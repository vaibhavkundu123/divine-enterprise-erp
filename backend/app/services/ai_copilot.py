from typing import Dict, List, Any
from sqlalchemy.orm import Session
from backend.app.models.entities import SalesOrder, RTOPipeline, CustomerReturn, ProcurementBatch, AdSpend
from backend.app.services.financial_engine import compute_system_financial_metrics, get_style_wac_map

def generate_ai_copilot_insights(db: Session) -> List[Dict[str, Any]]:
    """
    Executes the 5 canonical heuristic telemetry rules and returns 5 insight cards.
    """
    metrics = compute_system_financial_metrics(db)
    wac_map = get_style_wac_map(db)
    insights: List[Dict[str, Any]] = []

    # ---------------------------------------------------------
    # Rule 1: Star Performer Style Identification
    # ---------------------------------------------------------
    sales = db.query(SalesOrder).all()
    style_profits: Dict[str, Dict[str, Any]] = {}
    for s in sales:
        st = s.style_no.strip()
        if st not in style_profits:
            style_profits[st] = {"profit": 0.0, "units": 0, "revenue": 0.0}
        style_profits[st]["profit"] += s.profit
        style_profits[st]["units"] += s.quantity_sold
        style_profits[st]["revenue"] += s.total_revenue

    if style_profits:
        star_style, star_data = max(style_profits.items(), key=lambda item: item[1]["profit"])
        margin_pct = (star_data["profit"] / star_data["revenue"] * 100) if star_data["revenue"] > 0 else 0.0
        insights.append({
            "rule_id": 1,
            "category": "STAR_PERFORMER",
            "title": f"Star Performer: {star_style}",
            "severity": "SUCCESS",
            "badge": "Top Yield SKU",
            "summary": (
                f"Style {star_style} leads profitability with ${star_data['profit']:,.2f} gross profit "
                f"({margin_pct:.1f}% margin across {star_data['units']} units sold)."
            ),
            "metrics": {
                "style_no": star_style,
                "profit": round(star_data["profit"], 2),
                "margin_pct": round(margin_pct, 2),
                "units_sold": star_data["units"],
                "revenue": round(star_data["revenue"], 2),
            },
            "action_label": "Inspect Sales Ledger",
            "action_target": "sales",
            "action_filter": {"style_no": star_style},
        })
    else:
        insights.append({
            "rule_id": 1,
            "category": "STAR_PERFORMER",
            "title": "Star Performer: Awaiting Sales",
            "severity": "INFO",
            "badge": "Catalog",
            "summary": "Record your first dispatched orders to identify high-margin star products.",
            "metrics": {},
            "action_label": "Record New Sale",
            "action_target": "sales",
        })

    # ---------------------------------------------------------
    # Rule 2: Inventory Radar (Low Stock Detection <= 5 units)
    # ---------------------------------------------------------
    low_stock_items = metrics.get("low_stock_items", [])
    if low_stock_items:
        critical_skus = [item["style_no"] for item in low_stock_items[:3]]
        sku_str = ", ".join(critical_skus)
        if len(low_stock_items) > 3:
            sku_str += f" and {len(low_stock_items) - 3} more"
        insights.append({
            "rule_id": 2,
            "category": "INVENTORY_RADAR",
            "title": f"Stockout Warning: {len(low_stock_items)} Critical SKU(s)",
            "severity": "WARNING",
            "badge": "Reorder Alert",
            "summary": (
                f"{len(low_stock_items)} product style(s) have 5 or fewer units remaining ({sku_str}). "
                f"Proactive procurement is recommended to maintain sales velocity."
            ),
            "metrics": {
                "critical_count": len(low_stock_items),
                "critical_skus": [item["style_no"] for item in low_stock_items],
            },
            "action_label": "View Inventory Matrix",
            "action_target": "stock",
        })
    else:
        insights.append({
            "rule_id": 2,
            "category": "INVENTORY_RADAR",
            "title": "Inventory Levels Optimal",
            "severity": "SUCCESS",
            "badge": "Healthy Stock",
            "summary": (
                f"All styles possess adequate safety buffers. Total warehouse valuation stands at "
                f"${metrics['warehouse_stock_valuation']:,.2f} across {metrics['usable_stock_units']} sellable units."
            ),
            "metrics": {
                "usable_stock_units": metrics["usable_stock_units"],
                "warehouse_stock_valuation": metrics["warehouse_stock_valuation"],
            },
            "action_label": "Audit Stock Matrix",
            "action_target": "stock",
        })

    # ---------------------------------------------------------
    # Rule 3: Marketing Telemetry & Acquisition Efficiency (ROAS)
    # ---------------------------------------------------------
    ad_spend = metrics.get("total_ad_spend", 0.0)
    dispatched_roas = metrics.get("dispatched_roas", 0.0)
    adjusted_roas = metrics.get("adjusted_roas", 0.0)

    if ad_spend <= 0:
        insights.append({
            "rule_id": 3,
            "category": "MARKETING_TELEMETRY",
            "title": "Organic Growth Mode",
            "severity": "INFO",
            "badge": "Organic Mode",
            "summary": (
                f"Total ad spend is $0.00. Current revenue of ${metrics['total_system_revenue']:,.2f} "
                f"was generated purely through direct and organic traffic."
            ),
            "metrics": {"ad_spend": 0.0, "roas": 0.0},
            "action_label": "Log Ad Campaign",
            "action_target": "ads",
        })
    elif dispatched_roas >= 4.0:
        insights.append({
            "rule_id": 3,
            "category": "MARKETING_TELEMETRY",
            "title": f"Elite Acquisition Efficiency ({dispatched_roas:.2f}x ROAS)",
            "severity": "SUCCESS",
            "badge": "Tier 1: Elite ROAS",
            "summary": (
                f"Advertising yield is performing exceptionally at {dispatched_roas:.2f}x gross ROAS "
                f"({adjusted_roas:.2f}x adjusted realized). Scale top-performing channels."
            ),
            "metrics": {
                "ad_spend": ad_spend,
                "dispatched_roas": dispatched_roas,
                "adjusted_roas": adjusted_roas,
            },
            "action_label": "Inspect Ad Channels",
            "action_target": "ads",
        })
    elif dispatched_roas >= 2.0:
        insights.append({
            "rule_id": 3,
            "category": "MARKETING_TELEMETRY",
            "title": f"Healthy Acquisition Return ({dispatched_roas:.2f}x ROAS)",
            "severity": "INFO",
            "badge": "Tier 2: Healthy ROAS",
            "summary": (
                f"Campaigns are returning {dispatched_roas:.2f}x gross on ad spend (${ad_spend:,.2f} total spend). "
                f"Maintains positive customer acquisition margins."
            ),
            "metrics": {
                "ad_spend": ad_spend,
                "dispatched_roas": dispatched_roas,
                "adjusted_roas": adjusted_roas,
            },
            "action_label": "View Ad Analytics",
            "action_target": "ads",
        })
    else:
        insights.append({
            "rule_id": 3,
            "category": "MARKETING_TELEMETRY",
            "title": f"Marketing Efficiency Alert ({dispatched_roas:.2f}x ROAS)",
            "severity": "DANGER",
            "badge": "Tier 3: Low ROAS",
            "summary": (
                f"Campaign return is below target at {dispatched_roas:.2f}x ROAS with ${ad_spend:,.2f} spent. "
                f"Audit low-converting ad sets and adjust platform budget allocation."
            ),
            "metrics": {
                "ad_spend": ad_spend,
                "dispatched_roas": dispatched_roas,
                "adjusted_roas": adjusted_roas,
            },
            "action_label": "Optimize Ad Spend",
            "action_target": "ads",
        })

    # ---------------------------------------------------------
    # Rule 4: Warehouse Staging Opportunity (Quarantined Capital)
    # ---------------------------------------------------------
    rto_holding_units = metrics.get("rto_holding_units", 0)
    rto_holding_val = metrics.get("rto_holding_value", 0.0)
    cr_holding_units = metrics.get("cr_holding_units", 0)
    cr_holding_val = metrics.get("cr_holding_value", 0.0)

    total_quarantined_units = rto_holding_units + cr_holding_units
    total_quarantined_value = rto_holding_val + cr_holding_val

    if total_quarantined_units > 0:
        insights.append({
            "rule_id": 4,
            "category": "WAREHOUSE_STAGING",
            "title": f"Unlock ${total_quarantined_value:,.2f} Quarantined Capital",
            "severity": "WARNING",
            "badge": "Restock Trigger",
            "summary": (
                f"{total_quarantined_units} arrived parcel(s) ({rto_holding_units} RTO + {cr_holding_units} Customer Returns) "
                f"are sitting at intake docks. Shelving them restores stock on hand immediately."
            ),
            "metrics": {
                "quarantined_units": total_quarantined_units,
                "quarantined_value": total_quarantined_value,
                "rto_units": rto_holding_units,
                "cr_units": cr_holding_units,
            },
            "action_label": "Restock All Dock Units",
            "action_target": "rto",
            "can_auto_restock": True,
        })
    else:
        insights.append({
            "rule_id": 4,
            "category": "WAREHOUSE_STAGING",
            "title": "Reverse Logistics Cleared",
            "severity": "SUCCESS",
            "badge": "Dock Pristine",
            "summary": "Zero arrived parcels are pending unboxing or shelving. Quarantined staging buffers are 100% clear.",
            "metrics": {"quarantined_units": 0, "quarantined_value": 0.0},
            "action_label": "View RTO Pipeline",
            "action_target": "rto",
        })

    # ---------------------------------------------------------
    # Rule 5: Margin Velocity & Dual-Sync Reconciliation State
    # ---------------------------------------------------------
    net_profit = metrics.get("net_realized_profit", 0.0)
    net_margin = metrics.get("net_realized_margin", 0.0)
    gross_margin = metrics.get("gross_profit_margin", 0.0)
    severity_rule5 = "SUCCESS" if net_profit >= 0 else "DANGER"

    insights.append({
        "rule_id": 5,
        "category": "MARGIN_VELOCITY",
        "title": f"Bottom-Line Realized: ${net_profit:,.2f} ({net_margin:.1f}%)",
        "severity": severity_rule5,
        "badge": "Bottom-Line Integrity",
        "summary": (
            f"True realized net cash is ${net_profit:,.2f} ({net_margin:.1f}% net margin vs {gross_margin:.1f}% gross). "
            f"Dual-sync engine actively reconciles procurement rates, returns, and bank statements."
        ),
        "metrics": {
            "net_realized_profit": net_profit,
            "net_realized_margin": net_margin,
            "gross_profit_margin": gross_margin,
            "bank_balance": metrics.get("bank_running_balance", 0.0),
        },
        "action_label": "View Performance Hub",
        "action_target": "analytics",
    })

    return insights
