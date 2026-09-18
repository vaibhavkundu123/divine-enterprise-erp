import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
import tempfile
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.db.session import get_db
from backend.app.models.entities import Base
from backend.app.db.init_db import init_db

# Create temporary isolated SQLite database for testing
temp_dir = tempfile.mkdtemp()
test_db_path = f"{temp_dir}/test.db"
test_engine = create_engine(f"sqlite:///{test_db_path}", connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    init_db(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=test_engine)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_procurement_routes():
    # List
    res = client.get("/api/procurement")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

    # Create
    payload = {
        "date": "2026-09-17",
        "style_no": "TEST-SKU-999",
        "inventory": 20,
        "purchase_rate": 150.0,
    }
    create_res = client.post("/api/procurement", json=payload)
    assert create_res.status_code == 200
    created = create_res.json()
    assert created["style_no"] == "TEST-SKU-999"
    assert created["total_value"] == 3000.0

    # Daily summary
    daily_res = client.get("/api/procurement/daily")
    assert daily_res.status_code == 200

def test_sales_and_preview_routes():
    # Preview
    preview_res = client.post("/api/sales/preview", json={
        "style_no": "TEST-SKU-999",
        "quantity_sold": 2,
        "selling_price": 250.0,
    })
    assert preview_res.status_code == 200
    prev_data = preview_res.json()
    assert prev_data["total_revenue"] == 500.0
    assert prev_data["cogs"] == 300.0
    assert prev_data["profit"] == 200.0

    # Create order
    order_res = client.post("/api/sales", json={
        "date": "2026-09-17",
        "style_no": "TEST-SKU-999",
        "quantity_sold": 2,
        "selling_price": 250.0,
    })
    assert order_res.status_code == 200
    order_data = order_res.json()
    assert order_data["total_revenue"] == 500.0
    assert order_data["profit"] == 200.0

def test_stock_matrix_routes():
    res = client.get("/api/stock")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0

    cat_res = client.get("/api/stock/styles")
    assert cat_res.status_code == 200
    assert len(cat_res.json()) > 0

def test_rto_pipeline_routes():
    # Create RTO
    rto_res = client.post("/api/rto", json={
        "date": "2026-09-17",
        "style_no": "TEST-SKU-999",
        "quantity": 1,
        "sale_price": 250.0,
        "courier_fee": 50.0,
    })
    assert rto_res.status_code == 200
    rto_data = rto_res.json()
    rto_id = rto_data["id"]

    # Mark Received
    rec_res = client.post(f"/api/rto/{rto_id}/receive")
    assert rec_res.status_code == 200
    assert rec_res.json()["status"] == "Received"

    # Restock
    rest_res = client.post(f"/api/rto/{rto_id}/restock")
    assert rest_res.status_code == 200
    assert rest_res.json()["status"] == "Restocked"

def test_customer_returns_routes():
    ret_res = client.post("/api/customer-returns", json={
        "date": "2026-09-17",
        "style_no": "TEST-SKU-999",
        "quantity": 1,
        "refund_amount": 250.0,
        "reverse_fee": 175.0,
        "primary_reason": "Size Issue",
    })
    assert ret_res.status_code == 200
    ret_id = ret_res.json()["id"]

    # QC grading
    qc_res = client.post(f"/api/customer-returns/{ret_id}/qc?grade=Grade%20A")
    assert qc_res.status_code == 200
    assert qc_res.json()["qc_grade"] == "Grade A"

def test_exchanges_routes():
    ex_res = client.post("/api/exchanges", json={
        "date": "2026-09-17",
        "original_style": "TEST-SKU-999",
        "exchanged_style": "TEST-SKU-999",
        "quantity": 1,
        "standard_price": 300.0,
        "reverse_fee": 175.0,
    })
    assert ex_res.status_code == 200
    ex_data = ex_res.json()
    assert ex_data["amount_received"] == 125.0

def test_ads_and_bank_routes():
    # Ad Spend
    ad_res = client.post("/api/ads", json={
        "date": "2026-09-17",
        "platform": "Meta Ads",
        "amount": 250.0,
    })
    assert ad_res.status_code == 200

    sum_res = client.get("/api/ads/summary")
    assert sum_res.status_code == 200

    # Bank
    bank_res = client.post("/api/bank", json={
        "date": "2026-09-17",
        "type": "Credited (+)",
        "amount": 5000.0,
    })
    assert bank_res.status_code == 200
    assert "running_balance" in bank_res.json()

def test_analytics_and_telemetry_routes():
    kpis_res = client.get("/api/analytics/kpis")
    assert kpis_res.status_code == 200
    kpis = kpis_res.json()
    assert "gross_sales_revenue" in kpis
    assert "net_realized_profit" in kpis

    copilot_res = client.get("/api/analytics/copilot")
    assert copilot_res.status_code == 200
    copilot_cards = copilot_res.json()
    assert len(copilot_cards) == 5

    waveforms_res = client.get("/api/analytics/waveforms?horizon=30D")
    assert waveforms_res.status_code == 200
    assert "waveforms" in waveforms_res.json()

def test_audit_routes():
    res = client.get("/api/audit")
    assert res.status_code == 200
    logs = res.json()
    assert isinstance(logs, list)
    assert len(logs) > 0
