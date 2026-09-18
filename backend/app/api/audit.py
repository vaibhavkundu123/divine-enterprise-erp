import csv
import io
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from backend.app.db.session import get_db, DATA_DIR
from backend.app.models.entities import ActivityAuditLog
from backend.app.schemas.schemas import ActivityAuditLogOut

router = APIRouter(prefix="/api/audit", tags=["Regulatory Audit Trail"])

@router.get("", response_model=List[ActivityAuditLogOut])
def list_audit_logs(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(ActivityAuditLog)
    if category and category.lower() != "undefined" and category.upper() != "ALL":
        query = query.filter(ActivityAuditLog.category == category.upper().strip())
    if status and status.lower() != "undefined":
        query = query.filter(ActivityAuditLog.status == status.upper().strip())
    if search and search.lower() != "undefined":
        s = f"%{search.strip()}%"
        query = query.filter(
            (ActivityAuditLog.summary.ilike(s)) |
            (ActivityAuditLog.details.ilike(s)) |
            (ActivityAuditLog.action.ilike(s))
        )
    return query.order_by(ActivityAuditLog.id.asc()).offset(offset).limit(limit).all()

@router.get("/export-csv")
def export_audit_logs_csv(db: Session = Depends(get_db)):
    logs = db.query(ActivityAuditLog).order_by(ActivityAuditLog.id.asc()).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Timestamp", "Category", "Action", "Summary", "Status", "Source", "Details"])
    for l in logs:
        writer.writerow([l.id, l.timestamp, l.category, l.action, l.summary, l.status, l.source, l.details or ""])
    output.seek(0)

    filename = f"audit_trail_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )

@router.post("/clear")
def clear_and_archive_audit_logs(db: Session = Depends(get_db)):
    """Creates a timestamped disk archive before clearing logs"""
    logs = db.query(ActivityAuditLog).order_by(ActivityAuditLog.id.asc()).all()
    if logs:
        archive_dir = DATA_DIR / "archives"
        archive_dir.mkdir(parents=True, exist_ok=True)
        archive_filename = f"audit_archive_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        archive_path = archive_dir / archive_filename

        with open(archive_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["ID", "Timestamp", "Category", "Action", "Summary", "Status", "Source", "Details"])
            for l in logs:
                writer.writerow([l.id, l.timestamp, l.category, l.action, l.summary, l.status, l.source, l.details or ""])

        db.query(ActivityAuditLog).delete()
        db.commit()

        # Add initial clear audit record
        new_log = ActivityAuditLog(
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            category="SYSTEM",
            action="CLEAR",
            summary=f"Archived {len(logs)} logs to {archive_filename} and cleared active trail",
            status="WARNING",
            source="Web Admin",
        )
        db.add(new_log)
        db.commit()

        return {
            "message": f"Successfully archived {len(logs)} records and cleared active trail.",
            "archive_file": archive_filename,
        }

    return {"message": "Audit trail was already empty."}
