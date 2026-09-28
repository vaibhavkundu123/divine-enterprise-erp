import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
import tempfile
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.db.session import get_db
from backend.app.models.entities import Base, ProductCatalog
from backend.app.db.init_db import init_db

@pytest.fixture(scope="module")
def client():
    temp_dir = tempfile.mkdtemp()
    test_db_path = f"{temp_dir}/test_catalog.db"
    test_engine = create_engine(f"sqlite:///{test_db_path}", connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    init_db(db)
    db.close()

    def override_get_db():
        session = TestingSessionLocal()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

def test_catalog_listing(client):
    res = client.get("/api/catalog")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 41
    # Verify fields
    item = data[0]
    assert "style_no" in item
    assert "individual_barcode" in item
    assert "meesho_price" in item
    assert "stock_on_hand" in item

def test_catalog_stats(client):
    res = client.get("/api/catalog/stats")
    assert res.status_code == 200
    stats = res.json()
    assert stats["total_skus"] >= 41
    assert stats["unique_colors"] >= 10
    assert "missing_images_count" in stats
    assert "avg_meesho_price" in stats

def test_barcode_lookup(client):
    # Lookup by individual barcode
    res = client.get("/api/catalog/barcode/DE26030B103313")
    assert res.status_code == 200
    item = res.json()
    assert item["style_no"] == "DE26030B"
    assert item["colour"] == "Black"
    assert item["is_pack_barcode"] is False

    # Lookup by pack barcode
    res_pack = client.get("/api/catalog/barcode/PDE26030B103313")
    assert res_pack.status_code == 200
    pack_item = res_pack.json()
    assert pack_item["is_pack_barcode"] is True

def test_barcode_not_found(client):
    res = client.get("/api/catalog/barcode/NONEXISTENT99999")
    assert res.status_code == 404

def test_update_catalog_product(client):
    # Retrieve product 1
    p = client.get("/api/catalog").json()[0]
    p_id = p["id"]
    new_price = 330.0

    res = client.put(f"/api/catalog/{p_id}", json={
        "meesho_price": new_price,
        "image_url": "https://example.com/test_front.jpg"
    })
    assert res.status_code == 200
    updated = res.json()
    assert updated["meesho_price"] == new_price
    assert updated["wrong_return_price"] == new_price - 22 # Auto-adjusted
    assert updated["image_url"] == "https://example.com/test_front.jpg"

def test_create_catalog_product(client):
    import uuid
    uid = uuid.uuid4().hex[:6].upper()
    style_test = f"DE26_{uid}"
    payload = {
        "style_no": style_test,
        "category": "Nighty",
        "sub_category": "Sleeveless",
        "product_type": "Square Neck",
        "colour": "Teal",
        "sizing": "XXL",
        "purchase_rate": 210.0,
        "profit_margin": 0.20,
        "meesho_price": 340.0,
        "mrp_pcs": 499.0,
        "image_url": "/Pic/DE26030/Black/Black_1.png",
    }
    res = client.post("/api/catalog", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["style_no"] == style_test
    assert data["colour"] == "Teal"
    assert data["wrong_return_price"] == 340.0 - 22.0
    assert data["individual_barcode"] is not None

def test_export_barcode_master(client):
    res = client.get("/api/catalog/export/barcode-master")
    assert res.status_code == 200
    assert "spreadsheetml.sheet" in res.headers["content-type"]

def test_export_meesho_template(client):
    res = client.get("/api/catalog/export/meesho-template")
    assert res.status_code == 200
    assert "spreadsheetml.sheet" in res.headers["content-type"]

def test_all_catalog_fields_present(client):
    res = client.get("/api/catalog")
    assert res.status_code == 200
    items = res.json()
    assert len(items) >= 41
    item = items[0]
    expected_fields = [
        # Barcode Master fields
        "sl_no", "season", "style_no", "category", "sub_category", "product_type",
        "sub_product", "fabric_composition", "fabric_type", "no_of_components",
        "colour", "sizing", "num_size_per_set", "individual_barcode", "purchase_rate",
        "profit_margin", "meesho_price", "mrp_pcs", "mrp_set", "pack_barcode",
        # Meesho Template fields
        "product_name", "wrong_return_price", "gst_pct", "hsn_id", "net_weight_gms",
        "inventory", "country_of_origin", "manufacturer_name", "manufacturer_address",
        "manufacturer_pincode", "packer_name", "packer_address", "packer_pincode",
        "importer_name", "importer_address", "importer_pincode", "add_ons", "fabric",
        "fit_type", "generic_name", "net_quantity", "bust_size", "length_size",
        "image_url", "image_url_2", "image_url_3", "image_url_4", "sku_id",
        "brand_name", "group_id", "description", "ean_upc", "brand", "length",
        "neck", "occasion", "pattern", "pockets", "print_type", "sleeve_length",
        "surface_styling", "hip_size", "waist_size"
    ]
    for field in expected_fields:
        assert field in item, f"Missing field in catalog response: {field}"

def test_delete_catalog_product(client):
    import uuid
    uid = uuid.uuid4().hex[:6].upper()
    # Create temporary SKU
    payload = {
        "style_no": f"TESTDEL_{uid}",
        "category": "Women",
        "sub_category": "Nightdress",
        "product_type": "Maxi",
        "colour": "Gold",
        "sizing": "XXL",
        "purchase_rate": 150.0,
        "profit_margin": 0.20,
        "meesho_price": 240.0,
        "mrp_pcs": 499.0
    }
    create_res = client.post("/api/catalog", json=payload)
    assert create_res.status_code == 201
    prod_id = create_res.json()["id"]

    # Delete it
    del_res = client.delete(f"/api/catalog/{prod_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # Verify 404 on get
    get_res = client.get(f"/api/catalog/{prod_id}")
    assert get_res.status_code == 404


