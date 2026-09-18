from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.entities import SalesOrder, AdSpend, ProcurementBatch, RTOPipeline, CustomerReturn, ItemExchange
from backend.app.services.financial_engine import (
    compute_system_financial_metrics,
    calculate_gross_profit,
    calculate_gross_profit_margin,
)
from backend.app.services.ai_copilot import generate_ai_copilot_insights

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Telemetry"])

@router.get("/kpis")
def get_system_kpis(db: Session = Depends(get_db)):
    return compute_system_financial_metrics(db)

@router.get("/copilot")
def get_ai_copilot_cards(db: Session = Depends(get_db)):
    return generate_ai_copilot_insights(db)

@router.get("/waveforms")
def get_trend_waveforms(
    horizon: str = Query("30D", description="7D, 30D, or ALL"),
    db: Session = Depends(get_db),
):
    sales = db.query(SalesOrder).order_by(SalesOrder.date.asc()).all()
    ads = db.query(AdSpend).order_by(AdSpend.date.asc()).all()
    rtos = db.query(RTOPipeline).filter(RTOPipeline.status.in_(["Received", "Restocked", "Damaged"])).all()
    returns = db.query(CustomerReturn).filter(CustomerReturn.status.in_(["Intake", "Received", "Restocked", "Damaged"])).all()

    # Aggregate by date
    dates_map: Dict[str, Dict[str, float]] = {}

    for s in sales:
        d = s.date
        if d not in dates_map:
            dates_map[d] = {"date": d, "revenue": 0.0, "cogs": 0.0, "ad_spend": 0.0, "rto_rev": 0.0, "refunds": 0.0, "units_sold": 0}
        dates_map[d]["revenue"] += s.total_revenue
        dates_map[d]["cogs"] += s.cogs
        dates_map[d]["units_sold"] = dates_map[d].get("units_sold", 0) + s.quantity_sold

    for a in ads:
        d = a.date
        if d not in dates_map:
            dates_map[d] = {"date": d, "revenue": 0.0, "cogs": 0.0, "ad_spend": 0.0, "rto_rev": 0.0, "refunds": 0.0, "units_sold": 0}
        dates_map[d]["ad_spend"] += a.amount

    for r in rtos:
        d = r.received_date or r.date
        if d in dates_map:
            dates_map[d]["rto_rev"] += r.reversed_revenue

    for cr in returns:
        d = cr.received_date or cr.date
        if d in dates_map:
            dates_map[d]["refunds"] += cr.refund_amount

    sorted_dates = sorted(dates_map.keys())

    # Filter based on horizon
    if horizon.upper() == "7D":
        selected_dates = sorted_dates[-7:] if len(sorted_dates) > 7 else sorted_dates
    elif horizon.upper() == "30D":
        selected_dates = sorted_dates[-30:] if len(sorted_dates) > 30 else sorted_dates
    else:  # ALL
        selected_dates = sorted_dates

    points = []
    for d in selected_dates:
        m = dates_map[d]
        rev = round(m["revenue"], 2)
        cogs = round(m["cogs"], 2)
        gross_profit = round(rev - cogs, 2)
        net_profit = round(gross_profit - m["ad_spend"] - m["rto_rev"] - m["refunds"], 2)
        points.append({
            "date": d,
            "gross_revenue": rev,
            "cogs": cogs,
            "gross_profit": gross_profit,
            "net_profit": net_profit,
            "ad_spend": round(m["ad_spend"], 2),
            "units_sold": int(m.get("units_sold", 0)),
        })

    return {
        "horizon": horizon,
        "data_points_count": len(points),
        "waveforms": points,
    }

@router.get("/daily-sales")
def get_daily_sales_analytics(db: Session = Depends(get_db)):
    sales = db.query(SalesOrder).order_by(SalesOrder.date.asc()).all()
    grouped: Dict[str, Dict[str, Any]] = {}

    for s in sales:
        d = s.date
        if d not in grouped:
            grouped[d] = {"date": d, "orders_count": 0, "units_sold": 0, "gross_revenue": 0.0, "total_cogs": 0.0}
        grouped[d]["orders_count"] += 1
        grouped[d]["units_sold"] += s.quantity_sold
        grouped[d]["gross_revenue"] += s.total_revenue
        grouped[d]["total_cogs"] += s.cogs

    result = []
    for d in sorted(grouped.keys(), reverse=False):
        g = grouped[d]
        rev = round(g["gross_revenue"], 2)
        cogs = round(g["total_cogs"], 2)
        gp = round(rev - cogs, 2)
        margin = round((gp / rev * 100), 2) if rev > 0 else 0.0
        result.append({
            "date": d,
            "orders_count": g["orders_count"],
            "units_sold": g["units_sold"],
            "gross_revenue": rev,
            "total_cogs": cogs,
            "gross_profit": gp,
            "gross_margin": margin,
        })
    return result

@router.get("/daily-ads")
def get_daily_ads_analytics(db: Session = Depends(get_db)):
    ads = db.query(AdSpend).order_by(AdSpend.date.asc()).all()
    grouped: Dict[str, Dict[str, Any]] = {}

    for a in ads:
        d = a.date
        if d not in grouped:
            grouped[d] = {"date": d, "campaign_count": 0, "platforms": set(), "total_ad_spend": 0.0}
        grouped[d]["campaign_count"] += 1
        grouped[d]["platforms"].add(a.platform)
        grouped[d]["total_ad_spend"] += a.amount

    result = []
    for d in sorted(grouped.keys(), reverse=False):
        g = grouped[d]
        result.append({
            "date": d,
            "campaign_count": g["campaign_count"],
            "platforms_used": ", ".join(sorted(g["platforms"])),
            "total_ad_spend": round(g["total_ad_spend"], 2),
        })
    return result
