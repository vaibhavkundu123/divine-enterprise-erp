from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.entities import ActivityAuditLog

def log_audit(
    db: Session,
    category: str,
    action: str,
    summary: str,
    status: str = "SUCCESS",
    source: str = "Web App",
    details: Optional[str] = None,
):
    audit = ActivityAuditLog(
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        category=category,
        action=action,
        summary=summary,
        status=status,
        source=source,
        details=details,
    )
    db.add(audit)
    db.commit()
