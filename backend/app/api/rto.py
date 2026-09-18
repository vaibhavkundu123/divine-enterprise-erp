from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.entities import RTOPipeline
from backend.app.schemas.schemas import RTOCreate, RTOUpdate, RTOOut
from backend.app.services.excel_sync import sync_all
from backend.app.api.deps import log_audit

router = APIRouter(prefix="/api/rto", tags=["RTO Pipeline"])

@router.get("", response_model=List[RTOOut])
def list_rto_parcels(
    status: Optional[str] = Query(None),
    style_no: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(RTOPipeline)
    if status:
        query = query.filter(RTOPipeline.status.ilike(status.strip()))
    if style_no:
        query = query.filter(RTOPipeline.style_no.ilike(f"%{style_no.strip()}%"))
    return query.order_by(RTOPipeline.date.asc(), RTOPipeline.id.asc()).all()

@router.post("", response_model=RTOOut)
def create_rto_parcel(
    payload: RTOCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    # Auto-generate RTO-XXX if not provided
    rto_id = payload.rto_id
    if not rto_id:
        count = db.query(RTOPipeline).count() + 1
        rto_id = f"RTO-{count:03d}"

    rev = payload.reversed_revenue if payload.reversed_revenue is not None else (payload.quantity * payload.sale_price)
    rto = RTOPipeline(
        rto_id=rto_id,
        date=payload.date,
        style_no=payload.style_no.strip(),
        quantity=max(1, payload.quantity),
        sale_price=payload.sale_price,
        reversed_revenue=round(rev, 2),
        courier_fee=payload.courier_fee,
        status=payload.status or "In Transit",
        tracking_no=payload.tracking_no,
        notes=payload.notes,
    )
    db.add(rto)
    db.commit()
    db.refresh(rto)

    log_audit(
        db,
        category="RTO",
        action="CREATE",
        summary=f"Logged RTO parcel {rto.rto_id}: {rto.quantity}x {rto.style_no} ({rto.status})",
    )
    background_tasks.add_task(sync_all)
    return rto

@router.post("/{rto_id}/receive", response_model=RTOOut)
def mark_rto_received(
    rto_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    rto = db.query(RTOPipeline).filter(RTOPipeline.id == rto_id).first()
    if not rto:
        raise HTTPException(status_code=404, detail="RTO record not found")

    today = datetime.now().strftime("%Y-%m-%d")
    rto.status = "Received"
    rto.received_date = today
    db.commit()
    db.refresh(rto)

    log_audit(
        db,
        category="RTO",
        action="RECEIVE",
        summary=f"RTO parcel {rto.rto_id} received at warehouse dock",
    )
    background_tasks.add_task(sync_all)
    return rto

@router.post("/{rto_id}/restock", response_model=RTOOut)
def restock_rto_parcel(
    rto_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    rto = db.query(RTOPipeline).filter(RTOPipeline.id == rto_id).first()
    if not rto:
        raise HTTPException(status_code=404, detail="RTO record not found")

    today = datetime.now().strftime("%Y-%m-%d")
    rto.status = "Restocked"
    rto.restocked_date = today
    if not rto.received_date:
        rto.received_date = today
    db.commit()
    db.refresh(rto)

    log_audit(
        db,
        category="RTO",
        action="RESTOCK",
        summary=f"Restocked {rto.quantity} unit(s) of {rto.style_no} from RTO {rto.rto_id}",
    )
    background_tasks.add_task(sync_all)
    return rto

@router.post("/{rto_id}/damage", response_model=RTOOut)
def mark_rto_damaged(
    rto_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    rto = db.query(RTOPipeline).filter(RTOPipeline.id == rto_id).first()
    if not rto:
        raise HTTPException(status_code=404, detail="RTO record not found")

    today = datetime.now().strftime("%Y-%m-%d")
    rto.status = "Damaged"
    if not rto.received_date:
        rto.received_date = today
    db.commit()
    db.refresh(rto)

    log_audit(
        db,
        category="RTO",
        action="DAMAGE",
        summary=f"RTO {rto.rto_id} ({rto.style_no}) written off as Damaged",
        status="WARNING",
    )
    background_tasks.add_task(sync_all)
    return rto

@router.post("/bulk-restock")
def bulk_restock_received_rto(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    parcels = db.query(RTOPipeline).filter(RTOPipeline.status == "Received").all()
    today = datetime.now().strftime("%Y-%m-%d")
    restocked_count = 0
    units_restocked = 0

    for p in parcels:
        p.status = "Restocked"
        p.restocked_date = today
        restocked_count += 1
        units_restocked += p.quantity

    db.commit()
    if restocked_count > 0:
        log_audit(
            db,
            category="RTO",
            action="RESTOCK",
            summary=f"Bulk restocked {restocked_count} received RTO parcels ({units_restocked} units restored to inventory)",
        )
        background_tasks.add_task(sync_all)

    return {
        "parcels_restocked": restocked_count,
        "units_restocked": units_restocked,
        "message": f"Successfully restocked {restocked_count} parcels ({units_restocked} units).",
    }

@router.put("/{rto_id}", response_model=RTOOut)
def update_rto_parcel(
    rto_id: int,
    payload: RTOUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    rto = db.query(RTOPipeline).filter(RTOPipeline.id == rto_id).first()
    if not rto:
        raise HTTPException(status_code=404, detail="RTO record not found")

    for k, v in payload.dict(exclude_unset=True).items():
        setattr(rto, k, v)

    # If quantity or sale_price changed, recalculate reversed revenue
    rto.reversed_revenue = round(rto.quantity * rto.sale_price, 2)
    db.commit()
    db.refresh(rto)

    log_audit(
        db,
        category="RTO",
        action="UPDATE",
        summary=f"Updated RTO parcel {rto.rto_id} ({rto.style_no})",
    )
    background_tasks.add_task(sync_all)
    return rto

@router.delete("/{rto_id}")
def delete_rto_parcel(
    rto_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    rto = db.query(RTOPipeline).filter(RTOPipeline.id == rto_id).first()
    if not rto:
        raise HTTPException(status_code=404, detail="RTO record not found")

    rto_code = rto.rto_id
    db.delete(rto)
    db.commit()

    log_audit(
        db,
        category="RTO",
        action="DELETE",
        summary=f"Deleted RTO record {rto_code}",
        status="WARNING",
    )
    background_tasks.add_task(sync_all)
    return {"message": "RTO record deleted"}
