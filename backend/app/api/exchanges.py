from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.entities import ItemExchange
from backend.app.schemas.schemas import ItemExchangeCreate, ItemExchangeUpdate, ItemExchangeOut
from backend.app.services.financial_engine import (
    calculate_exchange_settlement,
    calculate_cogs,
    get_style_wac_map,
)
from backend.app.services.excel_sync import sync_all
from backend.app.api.deps import log_audit

router = APIRouter(prefix="/api/exchanges", tags=["Item Exchanges"])

@router.get("", response_model=List[ItemExchangeOut])
def list_exchanges(
    return_status: Optional[str] = Query(None),
    style_no: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(ItemExchange)
    if return_status:
        query = query.filter(ItemExchange.return_status.ilike(return_status.strip()))
    if style_no:
        query = query.filter(
            (ItemExchange.original_style.ilike(f"%{style_no.strip()}%")) |
            (ItemExchange.exchanged_style.ilike(f"%{style_no.strip()}%"))
        )
    return query.order_by(ItemExchange.date.asc(), ItemExchange.id.asc()).all()

@router.post("", response_model=ItemExchangeOut)
def create_exchange(
    payload: ItemExchangeCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    ex_id = payload.exchange_id
    if not ex_id:
        count = db.query(ItemExchange).count() + 1
        ex_id = f"EX-{count:03d}"

    qty = max(1, payload.quantity)
    amt_rec = calculate_exchange_settlement(payload.standard_price, qty, payload.reverse_fee)
    wac_map = get_style_wac_map(db)
    unit_cost = wac_map.get(payload.exchanged_style.strip(), 0.0)
    cogs = calculate_cogs(qty, unit_cost)
    profit = round(amt_rec - cogs, 2)

    exchange = ItemExchange(
        exchange_id=ex_id,
        date=payload.date,
        original_style=payload.original_style.strip(),
        exchanged_style=payload.exchanged_style.strip(),
        quantity=qty,
        standard_price=payload.standard_price,
        reverse_fee=payload.reverse_fee,
        amount_received=amt_rec,
        cogs=cogs,
        profit=profit,
        primary_reason=payload.primary_reason,
        secondary_reason=payload.secondary_reason,
        return_status=payload.return_status or "In Transit",
        exchange_status=payload.exchange_status or "Dispatched",
        reverse_awb=payload.reverse_awb,
    )
    db.add(exchange)
    db.commit()
    db.refresh(exchange)

    log_audit(
        db,
        category="EXCHANGE",
        action="CREATE",
        summary=f"Created exchange {exchange.exchange_id}: {exchange.original_style} -> {exchange.exchanged_style}",
        details=f"Settlement Amount: ${amt_rec:,.2f}, Yield: ${profit:,.2f}",
    )
    background_tasks.add_task(sync_all)
    return exchange

@router.post("/{ex_id}/receive", response_model=ItemExchangeOut)
def receive_exchange_return(
    ex_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    ex = db.query(ItemExchange).filter(ItemExchange.id == ex_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exchange record not found")

    today = datetime.now().strftime("%Y-%m-%d")
    ex.return_status = "Received"
    ex.received_date = today
    db.commit()
    db.refresh(ex)

    log_audit(
        db,
        category="EXCHANGE",
        action="RECEIVE",
        summary=f"Returned item for exchange {ex.exchange_id} arrived at intake dock",
    )
    background_tasks.add_task(sync_all)
    return ex

@router.post("/{ex_id}/restock", response_model=ItemExchangeOut)
def restock_exchange_return(
    ex_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    ex = db.query(ItemExchange).filter(ItemExchange.id == ex_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exchange record not found")

    today = datetime.now().strftime("%Y-%m-%d")
    ex.return_status = "Restocked"
    ex.restocked_date = today
    if not ex.received_date:
        ex.received_date = today
    db.commit()
    db.refresh(ex)

    log_audit(
        db,
        category="EXCHANGE",
        action="RESTOCK",
        summary=f"Restocked original style {ex.original_style} from exchange {ex.exchange_id}",
    )
    background_tasks.add_task(sync_all)
    return ex

@router.post("/{ex_id}/damage", response_model=ItemExchangeOut)
def damage_exchange_return(
    ex_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    ex = db.query(ItemExchange).filter(ItemExchange.id == ex_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exchange record not found")

    today = datetime.now().strftime("%Y-%m-%d")
    ex.return_status = "Damaged"
    if not ex.received_date:
        ex.received_date = today
    db.commit()
    db.refresh(ex)

    log_audit(
        db,
        category="EXCHANGE",
        action="DAMAGE",
        summary=f"Exchange {ex.exchange_id} ({ex.original_style}) returned item written off as Damaged",
        status="WARNING",
    )
    background_tasks.add_task(sync_all)
    return ex

@router.post("/bulk-restock")
def bulk_restock_intake_exchanges(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    items = db.query(ItemExchange).filter(ItemExchange.return_status.in_(["Intake", "Received"])).all()
    today = datetime.now().strftime("%Y-%m-%d")
    count = 0
    units = 0

    for it in items:
        it.return_status = "Restocked"
        it.restocked_date = today
        count += 1
        units += it.quantity

    db.commit()
    if count > 0:
        log_audit(
            db,
            category="EXCHANGE",
            action="RESTOCK",
            summary=f"Bulk restocked {count} exchange items ({units} units)",
        )
        background_tasks.add_task(sync_all)

    return {"restocked_count": count, "units_restocked": units, "message": f"Restocked {count} exchange return items"}

@router.put("/{ex_id}", response_model=ItemExchangeOut)
def update_exchange(
    ex_id: int,
    payload: ItemExchangeUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    ex = db.query(ItemExchange).filter(ItemExchange.id == ex_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exchange record not found")

    for k, v in payload.dict(exclude_unset=True).items():
        setattr(ex, k, v)

    # Recalculate settlement and profit
    ex.amount_received = calculate_exchange_settlement(ex.standard_price, ex.quantity, ex.reverse_fee)
    wac_map = get_style_wac_map(db)
    unit_cost = wac_map.get(ex.exchanged_style.strip(), 0.0)
    ex.cogs = calculate_cogs(ex.quantity, unit_cost)
    ex.profit = round(ex.amount_received - ex.cogs, 2)

    db.commit()
    db.refresh(ex)

    log_audit(
        db,
        category="EXCHANGE",
        action="UPDATE",
        summary=f"Updated exchange {ex.exchange_id}",
    )
    background_tasks.add_task(sync_all)
    return ex

@router.delete("/{ex_id}")
def delete_exchange(
    ex_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    ex = db.query(ItemExchange).filter(ItemExchange.id == ex_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exchange record not found")

    code = ex.exchange_id
    db.delete(ex)
    db.commit()

    log_audit(
        db,
        category="EXCHANGE",
        action="DELETE",
        summary=f"Deleted exchange {code}",
        status="WARNING",
    )
    background_tasks.add_task(sync_all)
    return {"message": "Exchange record deleted"}
