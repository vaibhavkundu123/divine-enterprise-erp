import pytest
from backend.app.services.financial_engine import (
    calculate_usable_stock,
    calculate_stock_valuation,
    calculate_total_portfolio_value,
    calculate_weighted_average_cost,
    calculate_gross_revenue,
    calculate_unit_price_from_invoice,
    calculate_total_system_revenue,
    calculate_cogs,
    calculate_gross_profit,
    calculate_gross_profit_margin,
    calculate_aov,
    calculate_adjusted_revenue,
    calculate_adjusted_units_sold,
    calculate_recovered_cogs,
    calculate_damaged_cogs_loss,
    calculate_reversed_profit,
    calculate_dispatched_net_profit,
    calculate_net_realized_profit,
    calculate_net_realized_margin,
    calculate_reverse_logistics_rates,
    calculate_exchange_settlement,
    calculate_roas,
    calculate_bank_running_balance,
    calculate_dynamic_markup_price,
    get_inventory_health_badge,
    compute_system_financial_metrics,
)
from backend.app.services.ai_copilot import generate_ai_copilot_insights
from backend.app.db.session import SessionLocal
from backend.app.db.init_db import init_db

def test_inventory_and_valuation_formulas():
    # 1. Usable Stock on Hand
    stock = calculate_usable_stock(
        units_purchased=100,
        units_sold=40,
        exchanged_outflow=5,
        restocked_rto=3,
        restocked_cr=2,
        restocked_exch=1,
    )
    assert stock == 61, f"Expected 61, got {stock}"

    # 2. Stock Valuation
    val = calculate_stock_valuation(stock_on_hand=61, unit_purchase_cost=200.0)
    assert val == 12200.0

    # Valuation for negative stock should clamp to 0
    val_neg = calculate_stock_valuation(stock_on_hand=-5, unit_purchase_cost=200.0)
    assert val_neg == 0.0

    # 3. Portfolio Value
    batches = [
        {"inventory": 50, "purchase_rate": 100.0},
        {"inventory": 50, "purchase_rate": 150.0},
    ]
    p_val = calculate_total_portfolio_value(batches)
    assert p_val == 12500.0

    # 4. WAC
    wac = calculate_weighted_average_cost(batches)
    assert wac == 125.0

def test_sales_and_revenue_formulas():
    # 5. Gross Sales Revenue & Inverse Pricing
    rev = calculate_gross_revenue(quantity_sold=3, unit_selling_price=300.0)
    assert rev == 900.0

    unit_price = calculate_unit_price_from_invoice(total_invoice=900.0, quantity_sold=3)
    assert unit_price == 300.0

    # 6. Combined Sales & Exchange Revenue (Anti-Double-Counting)
    sys_rev_1 = calculate_total_system_revenue(
        sales_dispatched_revenue=1000.0,
        exchange_gross_revenue=200.0,
        synchronized_exchange_in_sales=200.0,
    )
    assert sys_rev_1 == 1000.0  # Zero double-counting

    sys_rev_2 = calculate_total_system_revenue(
        sales_dispatched_revenue=1000.0,
        exchange_gross_revenue=200.0,
        synchronized_exchange_in_sales=0.0,
    )
    assert sys_rev_2 == 1200.0

    # 7. COGS
    cogs = calculate_cogs(quantity_sold=4, unit_purchase_cost=150.0)
    assert cogs == 600.0

    # 8. Gross Profit
    gp = calculate_gross_profit(total_system_revenue=1200.0, total_system_cogs=600.0)
    assert gp == 600.0

    # 9. Gross Profit Margin %
    gpm = calculate_gross_profit_margin(gross_profit=600.0, total_system_revenue=1200.0)
    assert gpm == 50.0

    # 10. AOV
    aov = calculate_aov(gross_sales_revenue=5000.0, total_orders=20)
    assert aov == 250.0

def test_reverse_logistics_and_realized_cash_formulas():
    # 11. Adjusted Sales Revenue
    adj_rev = calculate_adjusted_revenue(
        total_system_revenue=10000.0,
        rto_reversed_revenue_received=500.0,
        cr_refunds_issued_arrived=300.0,
    )
    assert adj_rev == 9200.0

    # 12. Adjusted Units Sold
    adj_units = calculate_adjusted_units_sold(
        total_units_sold=100,
        unsync_exchange_units=0,
        rto_units_received=5,
        cr_units_arrived=3,
    )
    assert adj_units == 92

    # 13. Recovered COGS
    rec_cogs = calculate_recovered_cogs([
        {"units": 2, "unit_cost": 100.0},
        {"units": 3, "unit_cost": 150.0},
    ])
    assert rec_cogs == 650.0

    # 14. Damaged COGS Loss
    dam_cogs = calculate_damaged_cogs_loss([
        {"units": 1, "unit_cost": 120.0},
    ])
    assert dam_cogs == 120.0

    # 15. Reversed Profit
    rev_profit = calculate_reversed_profit(reversed_revenue_or_refund=500.0, recovered_cogs=300.0)
    assert rev_profit == 200.0

    # 16. Dispatched Net Profit
    disp_net = calculate_dispatched_net_profit(
        gross_profit=4000.0,
        total_ad_spend=1000.0,
        total_rto_courier_fees=200.0,
        cr_reverse_fees_incurred=175.0,
    )
    assert disp_net == 2625.0

    # 17. Net Realized Profit (5-tier true bottom line)
    net_realized = calculate_net_realized_profit(
        dispatched_net_profit=disp_net,
        rto_reversed_profit=200.0,
        rto_damaged_cogs_loss=100.0,
        cr_reversed_profit=150.0,
        cr_damaged_cogs_loss=50.0,
    )
    assert net_realized == 2125.0

    # 18. Net Realized Margin %
    net_margin = calculate_net_realized_margin(net_realized_profit=2125.0, adjusted_revenue=8500.0)
    assert net_margin == 25.0

    # 19. Reverse Logistics Rates
    rates = calculate_reverse_logistics_rates(
        total_units_sold=200,
        total_rto_units=10,
        total_cr_units=8,
        total_exchange_units=4,
    )
    assert rates["rto_rate"] == 5.0
    assert rates["cr_rate"] == 4.0
    assert rates["exchange_rate"] == 2.0

    # 20. Item Exchange Settlement
    settle = calculate_exchange_settlement(standard_price=350.0, quantity=1, reverse_shipping_fee=175.0)
    assert settle == 175.0

def test_marketing_and_banking_formulas():
    # 21. ROAS
    roas = calculate_roas(
        total_system_revenue=12000.0,
        adjusted_revenue=10000.0,
        total_ad_spend=2500.0,
    )
    assert roas["dispatched_roas"] == 4.8
    assert roas["adjusted_roas"] == 4.0

    # 22. Bank Running Balance
    b1 = calculate_bank_running_balance(previous_balance=1000.0, credit_amount=500.0)
    assert b1 == 1500.0
    b2 = calculate_bank_running_balance(previous_balance=b1, debit_amount=300.0)
    assert b2 == 1200.0

    # 23. Dynamic Markup Pricing
    p25 = calculate_dynamic_markup_price(unit_purchase_cost=200.0, markup_fraction=0.25)
    assert p25 == 250.0
    p50 = calculate_dynamic_markup_price(unit_purchase_cost=200.0, markup_fraction=0.50)
    assert p50 == 300.0

    # Badges
    assert get_inventory_health_badge(15) == "In Stock"
    assert get_inventory_health_badge(5) == "Low Stock"
    assert get_inventory_health_badge(0) == "Out of Stock"
    assert get_inventory_health_badge(-2) == "Over Sold"

def test_system_financial_aggregation_and_copilot():
    db = SessionLocal()
    init_db(db)

    metrics = compute_system_financial_metrics(db)
    assert metrics["units_sold"] > 0
    assert metrics["total_system_revenue"] > 0
    assert "net_realized_profit" in metrics
    assert "warehouse_stock_valuation" in metrics

    insights = generate_ai_copilot_insights(db)
    assert len(insights) == 5, f"Expected 5 AI Copilot rule insights, got {len(insights)}"
    rule_ids = [i["rule_id"] for i in insights]
    assert rule_ids == [1, 2, 3, 4, 5], "All 5 heuristic rules must be represented"

    db.close()
