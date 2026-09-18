from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Query, BackgroundTasks
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.entities import ProcurementBatch, SalesOrder, RTOPipeline, CustomerReturn, ItemExchange
from backend.app.services.financial_engine import (
    calculate_usable_stock,
    calculate_stock_valuation,
    get_style_wac_map,
    get_inventory_health_badge,
)
from backend.app.services.excel_sync import sync_all
from backend.app.api.deps import log_audit

router = APIRouter(prefix="/api/stock", tags=["Stock Matrix"])

@router.get("")
def get_stock_inventory_matrix(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    proc_batches = db.query(ProcurementBatch).all()
    sales = db.query(SalesOrder).all()
    rtos = db.query(RTOPipeline).all()
    returns = db.query(CustomerReturn).all()
    exchanges = db.query(ItemExchange).all()

    wac_map = get_style_wac_map(db)
    all_styles = sorted(list({p.style_no.strip() for p in proc_batches} | {s.style_no.strip() for s in sales}))

    matrix = []
    for st in all_styles:
        if search and search.lower() not in st.lower():
            continue

        tot_purchased = sum(p.inventory for p in proc_batches if p.style_no.strip() == st)
        tot_sold = sum(s.quantity_sold for s in sales if s.style_no.strip() == st)
        in_transit = sum(r.quantity for r in rtos if r.style_no.strip() == st and r.status == "In Transit")
        rto_holding = sum(r.quantity for r in rtos if r.style_no.strip() == st and r.status == "Received")
        
        rto_restocked = sum(r.quantity for r in rtos if r.style_no.strip() == st and r.status == "Restocked")
        cr_restocked = sum(cr.quantity for cr in returns if cr.style_no.strip() == st and cr.status == "Restocked")
        exch_restocked = sum(e.quantity for e in exchanges if e.original_style.strip() == st and e.return_status == "Restocked")

        exch_out = sum(e.quantity for e in exchanges if e.exchanged_style.strip() == st)
        exch_sales_for_style = [s for s in sales if s.style_no.strip() == st and (s.reference or "").strip() != ""]
        exch_sold_in_sales = sum(s.quantity_sold for s in exch_sales_for_style)
        unlinked_exch_out = max(0, exch_out - exch_sold_in_sales)

        stock_on_hand = tot_purchased - tot_sold - unlinked_exch_out + rto_restocked + cr_restocked + exch_restocked
        unit_cost = wac_map.get(st, 0.0)
        valuation = calculate_stock_valuation(stock_on_hand, unit_cost)
        tot_revenue = sum(s.total_revenue for s in sales if s.style_no.strip() == st)
        tot_profit = sum(s.profit for s in sales if s.style_no.strip() == st)
        health_status = get_inventory_health_badge(stock_on_hand)

        if status and status.lower() != health_status.lower():
            continue

        matrix.append({
            "style_no": st,
            "total_purchased": tot_purchased,
            "total_sold": tot_sold,
            "exch_out": exch_out,
            "unlinked_exch_out": unlinked_exch_out,
            "rto_restocked": rto_restocked,
            "cr_restocked": cr_restocked,
            "exch_restocked": exch_restocked,
            "in_transit_rto": in_transit,
            "rto_holding": rto_holding,
            "restocked_rto": rto_restocked + cr_restocked + exch_restocked,
            "stock_on_hand": stock_on_hand,
            "unit_cost": unit_cost,
            "stock_valuation": valuation,
            "total_revenue": round(tot_revenue, 2),
            "total_profit": round(tot_profit, 2),
            "status": health_status,
        })

    return matrix

@router.get("/styles")
def get_style_catalog(db: Session = Depends(get_db)):
    """Provides autocomplete style metadata for sales intake"""
    proc_batches = db.query(ProcurementBatch).all()
    sales = db.query(SalesOrder).all()
    rtos = db.query(RTOPipeline).all()
    returns = db.query(CustomerReturn).all()
    exchanges = db.query(ItemExchange).all()

    wac_map = get_style_wac_map(db)
    all_styles = sorted(list({p.style_no.strip() for p in proc_batches} | {s.style_no.strip() for s in sales}))

    catalog = []
    for st in all_styles:
        tot_purchased = sum(p.inventory for p in proc_batches if p.style_no.strip() == st)
        tot_sold = sum(s.quantity_sold for s in sales if s.style_no.strip() == st)
        
        rto_restocked = sum(r.quantity for r in rtos if r.style_no.strip() == st and r.status == "Restocked")
        cr_restocked = sum(cr.quantity for cr in returns if cr.style_no.strip() == st and cr.status == "Restocked")
        exch_restocked = sum(e.quantity for e in exchanges if e.original_style.strip() == st and e.return_status == "Restocked")

        exch_out = sum(e.quantity for e in exchanges if e.exchanged_style.strip() == st)
        exch_sales_for_style = [s for s in sales if s.style_no.strip() == st and (s.reference or "").strip() != ""]
        exch_sold_in_sales = sum(s.quantity_sold for s in exch_sales_for_style)
        unlinked_exch_out = max(0, exch_out - exch_sold_in_sales)

        soh = tot_purchased - tot_sold - unlinked_exch_out + rto_restocked + cr_restocked + exch_restocked
        unit_cost = wac_map.get(st, 0.0)

        catalog.append({
            "style_no": st,
            "stock_on_hand": soh,
            "unit_cost": unit_cost,
            "suggested_price_25": round(unit_cost * 1.25, 2),
            "suggested_price_35": round(unit_cost * 1.35, 2),
            "suggested_price_50": round(unit_cost * 1.50, 2),
            "suggested_price_75": round(unit_cost * 1.75, 2),
            "status": get_inventory_health_badge(soh),
        })

    return catalog

@router.post("/sync")
def trigger_manual_sync(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Manual trigger to synchronize SQLite records back to Excel workbooks and 3NF CSV files"""
    res = sync_all(db)
    log_audit(
        db,
        category="SYNC",
        action="EXPORT",
        summary="Manual dual-directional Excel and CSV synchronization completed",
    )
    return res
