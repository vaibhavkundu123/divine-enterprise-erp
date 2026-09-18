from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.entities import CustomerReturn
from backend.app.schemas.schemas import CustomerReturnCreate, CustomerReturnUpdate, CustomerReturnOut
from backend.app.services.excel_sync import sync_all
from backend.app.api.deps import log_audit

router = APIRouter(prefix="/api/customer-returns", tags=["Customer Returns"])

@router.get("", response_model=List[CustomerReturnOut])
def list_customer_returns(
    status: Optional[str] = Query(None),
    style_no: Optional[str] = Query(None),
    qc_grade: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(CustomerReturn)
    if status:
        query = query.filter(CustomerReturn.status.ilike(status.strip()))
    if style_no:
        query = query.filter(CustomerReturn.style_no.ilike(f"%{style_no.strip()}%"))
    if qc_grade:
        query = query.filter(CustomerReturn.qc_grade == qc_grade.strip())
    return query.order_by(CustomerReturn.date.asc(), CustomerReturn.id.asc()).all()

@router.post("", response_model=CustomerReturnOut)
def create_customer_return(
    payload: CustomerReturnCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    ret_id = payload.return_id
    if not ret_id:
        count = db.query(CustomerReturn).count() + 1
        ret_id = f"CR-{count:03d}"

    ret = CustomerReturn(
        return_id=ret_id,
        date=payload.date,
        style_no=payload.style_no.strip(),
        quantity=max(1, payload.quantity),
        refund_amount=payload.refund_amount,
        reverse_fee=payload.reverse_fee,
        primary_reason=payload.primary_reason,
        secondary_reason=payload.secondary_reason,
        status=payload.status or "In Transit",
        qc_grade=payload.qc_grade,
        reverse_awb=payload.reverse_awb,
        notes=payload.notes,
    )
    db.add(ret)
    db.commit()
    db.refresh(ret)

    log_audit(
        db,
        category="CUSTOMER_RETURN",
        action="CREATE",
        summary=f"Logged customer return {ret.return_id}: {ret.quantity}x {ret.style_no}",
    )
    background_tasks.add_task(sync_all)
    return ret

@router.post("/{ret_id}/receive", response_model=CustomerReturnOut)
def mark_customer_return_received(
    ret_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    ret = db.query(CustomerReturn).filter(CustomerReturn.id == ret_id).first()
    if not ret:
        raise HTTPException(status_code=404, detail="Return record not found")

    today = datetime.now().strftime("%Y-%m-%d")
    ret.status = "Received"
    ret.received_date = today
    db.commit()
    db.refresh(ret)

    log_audit(
        db,
        category="CUSTOMER_RETURN",
        action="RECEIVE",
        summary=f"Customer return {ret.return_id} received at warehouse dock",
    )
    background_tasks.add_task(sync_all)
    return ret

@router.post("/{ret_id}/damage", response_model=CustomerReturnOut)
def mark_customer_return_damaged(
    ret_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    ret = db.query(CustomerReturn).filter(CustomerReturn.id == ret_id).first()
    if not ret:
        raise HTTPException(status_code=404, detail="Return record not found")

    today = datetime.now().strftime("%Y-%m-%d")
    ret.status = "Damaged"
    if not ret.received_date:
        ret.received_date = today
    db.commit()
    db.refresh(ret)

    log_audit(
        db,
        category="CUSTOMER_RETURN",
        action="DAMAGE",
        summary=f"Customer return {ret.return_id} ({ret.style_no}) written off as Damaged",
        status="WARNING",
    )
    background_tasks.add_task(sync_all)
    return ret

@router.post("/{ret_id}/qc", response_model=CustomerReturnOut)
def record_qc_grade(
    ret_id: int,
    grade: str = Query(..., description="Grade A, Grade B, Damaged, Dispute"),
    notes: Optional[str] = Query(None),
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db),
):
    ret = db.query(CustomerReturn).filter(CustomerReturn.id == ret_id).first()
    if not ret:
        raise HTTPException(status_code=404, detail="Return record not found")

    today = datetime.now().strftime("%Y-%m-%d")
    ret.qc_grade = grade.strip()
    ret.status = "Intake"
    if not ret.received_date:
        ret.received_date = today
    if notes:
        ret.notes = notes

    db.commit()
    db.refresh(ret)

    log_audit(
        db,
        category="CUSTOMER_RETURN",
        action="GRADE",
        summary=f"QC Grade assigned to {ret.return_id}: {grade}",
    )
    if background_tasks:
        background_tasks.add_task(sync_all)
    return ret

@router.post("/{ret_id}/restock", response_model=CustomerReturnOut)
def restock_customer_return(
    ret_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    ret = db.query(CustomerReturn).filter(CustomerReturn.id == ret_id).first()
    if not ret:
        raise HTTPException(status_code=404, detail="Return record not found")

    today = datetime.now().strftime("%Y-%m-%d")
    ret.status = "Restocked"
    ret.restocked_date = today
    if not ret.received_date:
        ret.received_date = today
    db.commit()
    db.refresh(ret)

    log_audit(
        db,
        category="CUSTOMER_RETURN",
        action="RESTOCK",
        summary=f"Restocked customer return {ret.return_id} ({ret.quantity}x {ret.style_no}) into inventory",
    )
    background_tasks.add_task(sync_all)
    return ret

@router.post("/bulk-restock")
def bulk_restock_intake_returns(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    returns = db.query(CustomerReturn).filter(
        CustomerReturn.status.in_(["Intake", "Received"])
    ).all()
    today = datetime.now().strftime("%Y-%m-%d")
    count = 0
    units = 0

    for r in returns:
        # Grade A or Grade B or unscored are eligible for restock
        if r.qc_grade not in ("Damaged", "Dispute"):
            r.status = "Restocked"
            r.restocked_date = today
            count += 1
            units += r.quantity

    db.commit()
    if count > 0:
        log_audit(
            db,
            category="CUSTOMER_RETURN",
            action="RESTOCK",
            summary=f"Bulk restocked {count} customer return items ({units} units restored)",
        )
        background_tasks.add_task(sync_all)

    return {
        "parcels_restocked": count,
        "units_restocked": units,
        "message": f"Successfully restocked {count} returns ({units} units).",
    }

@router.put("/{ret_id}", response_model=CustomerReturnOut)
def update_customer_return(
    ret_id: int,
    payload: CustomerReturnUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    ret = db.query(CustomerReturn).filter(CustomerReturn.id == ret_id).first()
    if not ret:
        raise HTTPException(status_code=404, detail="Return record not found")

    for k, v in payload.dict(exclude_unset=True).items():
        setattr(ret, k, v)

    db.commit()
    db.refresh(ret)

    log_audit(
        db,
        category="CUSTOMER_RETURN",
        action="UPDATE",
        summary=f"Updated customer return {ret.return_id} ({ret.style_no})",
    )
    background_tasks.add_task(sync_all)
    return ret

@router.delete("/{ret_id}")
def delete_customer_return(
    ret_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    ret = db.query(CustomerReturn).filter(CustomerReturn.id == ret_id).first()
    if not ret:
        raise HTTPException(status_code=404, detail="Return record not found")

    code = ret.return_id
    db.delete(ret)
    db.commit()

    log_audit(
        db,
        category="CUSTOMER_RETURN",
        action="DELETE",
        summary=f"Deleted customer return {code}",
        status="WARNING",
    )
    background_tasks.add_task(sync_all)
    return {"message": "Customer return record deleted"}
