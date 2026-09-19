from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.entities import SalesOrder, ProcurementBatch, RTOPipeline, CustomerReturn, ItemExchange
from backend.app.schemas.schemas import (
    SalesOrderCreate,
    SalesOrderUpdate,
    SalesOrderOut,
    SalesPreviewRequest,
    SalesPreviewResponse,
)
from backend.app.services.financial_engine import (
    calculate_gross_revenue,
    calculate_unit_price_from_invoice,
    calculate_cogs,
    calculate_gross_profit,
    calculate_gross_profit_margin,
    calculate_usable_stock,
    get_style_wac_map,
)
from backend.app.services.excel_sync import sync_all
from backend.app.api.deps import log_audit

router = APIRouter(prefix="/api/sales", tags=["Sales"])

def get_style_stock_on_hand(db: Session, style_no: str) -> int:
    st = style_no.strip()
    p_units = sum(p.inventory for p in db.query(ProcurementBatch).filter(ProcurementBatch.style_no == st).all())
    s_units = sum(s.quantity_sold for s in db.query(SalesOrder).filter(SalesOrder.style_no == st).all())
    ex_out = sum(e.quantity for e in db.query(ItemExchange).filter(ItemExchange.exchanged_style == st).all())
    r_rto = sum(r.quantity for r in db.query(RTOPipeline).filter(RTOPipeline.style_no == st, RTOPipeline.status == "Restocked").all())
    r_cr = sum(cr.quantity for cr in db.query(CustomerReturn).filter(CustomerReturn.style_no == st, CustomerReturn.status == "Restocked").all())
    r_ex = sum(e.quantity for e in db.query(ItemExchange).filter(ItemExchange.original_style == st, ItemExchange.return_status == "Restocked").all())
    return calculate_usable_stock(p_units, s_units, ex_out, r_rto, r_cr, r_ex)

@router.get("", response_model=List[SalesOrderOut])
def list_sales_orders(
    style_no: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(SalesOrder)
    if style_no:
        query = query.filter(SalesOrder.style_no.ilike(f"%{style_no.strip()}%"))
    if date:
        query = query.filter(SalesOrder.date == date)
    return query.order_by(SalesOrder.date.asc(), SalesOrder.sl_no.asc(), SalesOrder.id.asc()).all()

@router.post("/preview", response_model=SalesPreviewResponse)
def preview_sales_calculation(payload: SalesPreviewRequest, db: Session = Depends(get_db)):
    st = payload.style_no.strip()
    qty = max(1, payload.quantity_sold)
    wac_map = get_style_wac_map(db)
    unit_cost = wac_map.get(st, 0.0)

    if payload.selling_price is not None and payload.selling_price > 0:
        price = payload.selling_price
        rev = calculate_gross_revenue(qty, price)
    elif payload.total_revenue is not None and payload.total_revenue > 0:
        rev = payload.total_revenue
        price = calculate_unit_price_from_invoice(rev, qty)
    else:
        # Default markup if not specified (e.g. 50% markup over cost)
        price = round(unit_cost * 1.5, 2)
        rev = calculate_gross_revenue(qty, price)

    cogs = calculate_cogs(qty, unit_cost)
    profit = calculate_gross_profit(rev, cogs)
    margin = calculate_gross_profit_margin(profit, rev)
    stock_on_hand = get_style_stock_on_hand(db, st)

    return SalesPreviewResponse(
        style_no=st,
        quantity_sold=qty,
        selling_price=price,
        total_revenue=rev,
        unit_purchase_cost=unit_cost,
        cogs=cogs,
        profit=profit,
        profit_margin=margin,
        stock_on_hand=stock_on_hand,
    )

@router.post("", response_model=SalesOrderOut)
def create_sales_order(
    payload: SalesOrderCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    st = payload.style_no.strip()
    qty = max(1, payload.quantity_sold)
    wac_map = get_style_wac_map(db)
    unit_cost = wac_map.get(st, 0.0)

    if payload.selling_price is not None and payload.selling_price > 0:
        price = payload.selling_price
        rev = calculate_gross_revenue(qty, price)
    elif payload.total_revenue is not None and payload.total_revenue > 0:
        rev = payload.total_revenue
        price = calculate_unit_price_from_invoice(rev, qty)
    else:
        raise HTTPException(status_code=400, detail="Must provide either selling_price or total_revenue")

    cogs = calculate_cogs(qty, unit_cost)
    profit = calculate_gross_profit(rev, cogs)
    margin = calculate_gross_profit_margin(profit, rev)

    max_sl = db.query(SalesOrder.sl_no).order_by(SalesOrder.sl_no.desc()).first()
    next_sl = (max_sl[0] + 1) if max_sl and max_sl[0] else (db.query(SalesOrder).count() + 1)

    order = SalesOrder(
        sl_no=next_sl,
        date=payload.date,
        style_no=st,
        quantity_sold=qty,
        selling_price=price,
        total_revenue=rev,
        unit_purchase_cost=round(unit_cost, 2),
        cogs=cogs,
        profit=profit,
        profit_margin=round(margin / 100.0, 4),  # store as decimal fraction for parity
        reference=payload.reference or "Sale",
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    log_audit(
        db,
        category="SALE",
        action="CREATE",
        summary=f"Sales order dispatched: {qty} units of {st} for ${rev:,.2f}",
        details=f"Order ID {order.id}, Profit: ${profit:,.2f} ({margin:.1f}%)",
    )
    background_tasks.add_task(sync_all)
    return order

@router.put("/{order_id}", response_model=SalesOrderOut)
def update_sales_order(
    order_id: int,
    payload: SalesOrderUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    order = db.query(SalesOrder).filter(SalesOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Sales order not found")

    if payload.date is not None:
        order.date = payload.date
    if payload.style_no is not None:
        order.style_no = payload.style_no.strip()
    if payload.quantity_sold is not None:
        order.quantity_sold = payload.quantity_sold
    if payload.reference is not None:
        order.reference = payload.reference

    st = order.style_no
    qty = order.quantity_sold
    wac_map = get_style_wac_map(db)
    unit_cost = wac_map.get(st, order.unit_purchase_cost)

    if payload.selling_price is not None and payload.selling_price > 0:
        order.selling_price = payload.selling_price
        order.total_revenue = calculate_gross_revenue(qty, order.selling_price)
    elif payload.total_revenue is not None and payload.total_revenue > 0:
        order.total_revenue = payload.total_revenue
        order.selling_price = calculate_unit_price_from_invoice(order.total_revenue, qty)
    else:
        order.total_revenue = calculate_gross_revenue(qty, order.selling_price)

    order.unit_purchase_cost = round(unit_cost, 2)
    order.cogs = calculate_cogs(qty, unit_cost)
    order.profit = calculate_gross_profit(order.total_revenue, order.cogs)
    margin = calculate_gross_profit_margin(order.profit, order.total_revenue)
    order.profit_margin = round(margin / 100.0, 4)

    db.commit()
    db.refresh(order)

    log_audit(
        db,
        category="SALE",
        action="UPDATE",
        summary=f"Updated sales order #{order.sl_no} ({order.style_no})",
    )
    background_tasks.add_task(sync_all)
    return order

@router.delete("/{order_id}")
def delete_sales_order(
    order_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    order = db.query(SalesOrder).filter(SalesOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Sales order not found")

    st = order.style_no
    qty = order.quantity_sold
    db.delete(order)
    db.commit()

    log_audit(
        db,
        category="SALE",
        action="DELETE",
        summary=f"Deleted sales order #{order_id} ({qty} units of {st} restored to stock)",
        status="WARNING",
    )
    background_tasks.add_task(sync_all)
    return {"message": "Sales order deleted and stock restored"}
