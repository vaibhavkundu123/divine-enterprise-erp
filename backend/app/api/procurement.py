from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.entities import ProcurementBatch
from backend.app.schemas.schemas import ProcurementBatchCreate, ProcurementBatchUpdate, ProcurementBatchOut
from backend.app.services.excel_sync import sync_all
from backend.app.api.deps import log_audit

router = APIRouter(prefix="/api/procurement", tags=["Procurement"])

@router.get("", response_model=List[ProcurementBatchOut])
def list_procurement_batches(
    style_no: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(ProcurementBatch)
    if style_no:
        query = query.filter(ProcurementBatch.style_no.ilike(f"%{style_no.strip()}%"))
    if date:
        query = query.filter(ProcurementBatch.date == date)
    return query.order_by(ProcurementBatch.date.asc(), ProcurementBatch.id.asc()).all()

@router.post("", response_model=ProcurementBatchOut)
def create_procurement_batch(
    payload: ProcurementBatchCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    total = payload.total_value if payload.total_value is not None else (payload.inventory * payload.purchase_rate)
    batch = ProcurementBatch(
        date=payload.date,
        style_no=payload.style_no.strip(),
        inventory=payload.inventory,
        purchase_rate=payload.purchase_rate,
        total_value=round(total, 2),
    )
    db.add(batch)
    db.commit()
    db.refresh(batch)

    log_audit(
        db,
        category="STOCK",
        action="CREATE",
        summary=f"Inward batch recorded: {batch.inventory} units of {batch.style_no} @ ${batch.purchase_rate:,.2f}",
        details=f"Batch ID {batch.id}, Total Value: ${batch.total_value:,.2f}",
    )
    background_tasks.add_task(sync_all)
    return batch

@router.put("/{batch_id}", response_model=ProcurementBatchOut)
def update_procurement_batch(
    batch_id: int,
    payload: ProcurementBatchUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    batch = db.query(ProcurementBatch).filter(ProcurementBatch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Procurement batch not found")

    if payload.date is not None:
        batch.date = payload.date
    if payload.style_no is not None:
        batch.style_no = payload.style_no.strip()
    if payload.inventory is not None:
        batch.inventory = payload.inventory
    if payload.purchase_rate is not None:
        batch.purchase_rate = payload.purchase_rate

    # Recalculate total value
    batch.total_value = round(batch.inventory * batch.purchase_rate, 2)
    db.commit()
    db.refresh(batch)

    log_audit(
        db,
        category="STOCK",
        action="UPDATE",
        summary=f"Updated procurement batch ID {batch.id} for {batch.style_no}",
    )
    background_tasks.add_task(sync_all)
    return batch

@router.delete("/{batch_id}")
def delete_procurement_batch(
    batch_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    batch = db.query(ProcurementBatch).filter(ProcurementBatch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Procurement batch not found")

    db.delete(batch)
    db.commit()

    log_audit(
        db,
        category="STOCK",
        action="DELETE",
        summary=f"Deleted procurement batch ID {batch_id} ({batch.style_no})",
        status="WARNING",
    )
    background_tasks.add_task(sync_all)
    return {"message": "Batch deleted successfully"}

@router.get("/daily")
def get_daily_procurement_summary(db: Session = Depends(get_db)):
    batches = db.query(ProcurementBatch).order_by(ProcurementBatch.date.asc()).all()
    grouped = {}
    for b in batches:
        if b.date not in grouped:
            grouped[b.date] = {"date": b.date, "styles": set(), "units": 0, "total": 0.0}
        grouped[b.date]["styles"].add(b.style_no)
        grouped[b.date]["units"] += b.inventory
        grouped[b.date]["total"] += b.total_value

    result = []
    for d in sorted(grouped.keys(), reverse=False):
        g = grouped[d]
        avg_rate = round(g["total"] / g["units"], 2) if g["units"] > 0 else 0.0
        result.append({
            "date": d,
            "style_count": len(g["styles"]),
            "total_units": g["units"],
            "daily_gross_total": round(g["total"], 2),
            "avg_purchase_rate": avg_rate,
        })
    return result
