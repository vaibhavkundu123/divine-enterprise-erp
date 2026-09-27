import os
import openpyxl
from datetime import datetime, date
from pathlib import Path
from sqlalchemy.orm import Session
from backend.app.db.session import engine, SessionLocal, BASE_DIR
from backend.app.models.entities import (
    Base,
    ProcurementBatch,
    SalesOrder,
    RTOPipeline,
    CustomerReturn,
    ItemExchange,
    AdSpend,
    BankTransaction,
    ActivityAuditLog,
    ProductCatalog,
)

def format_date(val) -> str:
    if val is None:
        return ""
    if isinstance(val, (datetime, date)):
        return val.strftime("%Y-%m-%d")
    val_str = str(val).strip()
    if " 00:00:00" in val_str:
        val_str = val_str.replace(" 00:00:00", "")
    return val_str

def safe_float(val, default: float = 0.0) -> float:
    if val is None:
        return default
    try:
        if isinstance(val, str):
            val = val.replace("$", "").replace(",", "").strip()
        return float(val)
    except (ValueError, TypeError):
        return default

def safe_int(val, default: int = 0) -> int:
    if val is None:
        return default
    try:
        if isinstance(val, str):
            val = val.replace(",", "").strip()
        return int(float(val))
    except (ValueError, TypeError):
        return default

def is_summary_row(val) -> bool:
    if not val:
        return False
    val_lower = str(val).strip().lower()
    return any(marker in val_lower for marker in ["total summary", "grand total", "total"])

def init_db(db: Session = None) -> None:
    # 1. Create tables
    Base.metadata.create_all(bind=engine)
    
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True

    try:
        # Check if already seeded
        existing_proc = db.query(ProcurementBatch).first()
        existing_sales = db.query(SalesOrder).first()
        existing_catalog = db.query(ProductCatalog).first()

        logistic_path = BASE_DIR / "Logistic.xlsx"
        sales_path = BASE_DIR / "Sales_Inventory.xlsx"
        barcode_master_path = BASE_DIR / "Barcode Master.xlsx"
        meesho_path = BASE_DIR / "Nightdress-10177-EXTERNAL-MeeshoTemplate2PricesGSTIN-Copy.xlsx"

        # Ingest Product Catalog from Barcode Master & Meesho Template
        if not existing_catalog and barcode_master_path.exists():
            meesho_meta = {}
            sku_order_list = []
            style_to_sku = {}
            if meesho_path.exists():
                try:
                    wb_m = openpyxl.load_workbook(meesho_path, data_only=True)
                    if "Nightdress-Fill this" in wb_m.sheetnames:
                        ws_m = wb_m["Nightdress-Fill this"]
                        for r in range(3, ws_m.max_row + 1):
                            sku = ws_m.cell(r, 34).value
                            if sku:
                                sku_str = str(sku).strip()
                                sku_order_list.append(sku_str)
                                meesho_meta[sku_str] = {
                                    "product_name": ws_m.cell(r, 2).value,
                                    "variation": ws_m.cell(r, 3).value,
                                    "meesho_price": ws_m.cell(r, 4).value,
                                    "wrong_return_price": ws_m.cell(r, 5).value,
                                    "mrp": ws_m.cell(r, 6).value,
                                    "gst_pct": safe_float(ws_m.cell(r, 7).value, 5.0),
                                    "hsn_id": ws_m.cell(r, 8).value,
                                    "net_weight_gms": ws_m.cell(r, 9).value,
                                    "inventory": safe_int(ws_m.cell(r, 10).value, 10),
                                    "country_of_origin": ws_m.cell(r, 11).value,
                                    "manufacturer_name": ws_m.cell(r, 12).value,
                                    "manufacturer_address": ws_m.cell(r, 13).value,
                                    "manufacturer_pincode": str(ws_m.cell(r, 14).value or "") if ws_m.cell(r, 14).value else None,
                                    "packer_name": ws_m.cell(r, 15).value,
                                    "packer_address": ws_m.cell(r, 16).value,
                                    "packer_pincode": str(ws_m.cell(r, 17).value or "") if ws_m.cell(r, 17).value else None,
                                    "importer_name": ws_m.cell(r, 18).value,
                                    "importer_address": ws_m.cell(r, 19).value,
                                    "importer_pincode": str(ws_m.cell(r, 20).value or "") if ws_m.cell(r, 20).value else None,
                                    "add_ons": ws_m.cell(r, 21).value,
                                    "color": ws_m.cell(r, 22).value,
                                    "fabric": ws_m.cell(r, 23).value,
                                    "fit_type": ws_m.cell(r, 24).value,
                                    "generic_name": ws_m.cell(r, 25).value,
                                    "net_quantity": str(ws_m.cell(r, 26).value or "1"),
                                    "bust_size": str(ws_m.cell(r, 27).value or "42"),
                                    "length_size": str(ws_m.cell(r, 28).value or "54"),
                                    "image_url": ws_m.cell(r, 29).value,
                                    "image_url_2": ws_m.cell(r, 30).value,
                                    "image_url_3": ws_m.cell(r, 31).value,
                                    "image_url_4": ws_m.cell(r, 32).value,
                                    "sku_id": ws_m.cell(r, 34).value,
                                    "brand_name": ws_m.cell(r, 35).value,
                                    "group_id": ws_m.cell(r, 36).value,
                                    "description": ws_m.cell(r, 37).value,
                                    "ean_upc": ws_m.cell(r, 38).value,
                                    "brand": ws_m.cell(r, 39).value,
                                    "length": ws_m.cell(r, 40).value,
                                    "neck": ws_m.cell(r, 41).value,
                                    "occasion": ws_m.cell(r, 42).value,
                                    "pattern": ws_m.cell(r, 43).value,
                                    "pockets": ws_m.cell(r, 44).value,
                                    "print_type": ws_m.cell(r, 45).value,
                                    "sleeve_length": ws_m.cell(r, 46).value,
                                    "surface_styling": ws_m.cell(r, 47).value,
                                    "hip_size": str(ws_m.cell(r, 48).value or "44"),
                                    "waist_size": str(ws_m.cell(r, 49).value or "36"),
                                }
                                for prefix_len in (8, 7, 6):
                                    st_sub = sku_str[:prefix_len]
                                    if st_sub not in style_to_sku:
                                        style_to_sku[st_sub] = sku_str
                except Exception as e:
                    print(f"Warning loading meesho meta: {e}")

            wb_bc = openpyxl.load_workbook(barcode_master_path, data_only=True)
            if "BARCODE" in wb_bc.sheetnames:
                ws_bc = wb_bc["BARCODE"]
                row_idx = 0
                for r in range(2, ws_bc.max_row + 1):
                    style = ws_bc.cell(r, 3).value
                    if not style:
                        continue
                    style_str = str(style).strip()
                    raw_sku = ws_bc.cell(r, 14).value
                    if raw_sku is not None and str(raw_sku).strip() and not str(raw_sku).strip().startswith("=") and str(raw_sku).strip() != "None":
                        sku = str(raw_sku).strip()
                    elif style_str in style_to_sku:
                        sku = style_to_sku[style_str]
                    elif row_idx < len(sku_order_list):
                        sku = sku_order_list[row_idx]
                    else:
                        sku = f"{style_str}100000"

                    row_idx += 1
                    m_data = meesho_meta.get(sku, {})
                    p_rate = safe_float(ws_bc.cell(r, 15).value, 0.0)
                    p_margin = safe_float(ws_bc.cell(r, 16).value, 0.18)
                    m_price = safe_float(ws_bc.cell(r, 17).value, 0.0)
                    w_price = safe_float(m_data.get("wrong_return_price"), (m_price - 22 if m_price > 22 else 0.0))
                    mrp_p = safe_float(ws_bc.cell(r, 18).value, 499.0)
                    mrp_s = safe_float(ws_bc.cell(r, 19).value, 499.0)
                    pack_bc = ws_bc.cell(r, 20).value
                    pack_str = str(pack_bc).strip() if (pack_bc and str(pack_bc).strip() != "None" and not str(pack_bc).strip().startswith("=")) else f"P{sku}"

                    product = ProductCatalog(
                        sl_no=safe_int(ws_bc.cell(r, 1).value, None),
                        season=str(ws_bc.cell(r, 2).value or "Everyday").strip(),
                        style_no=style_str,
                        category=str(ws_bc.cell(r, 4).value or "Nighty").strip(),
                        sub_category=str(ws_bc.cell(r, 5).value or "Sleeveless").strip(),
                        product_type=str(ws_bc.cell(r, 6).value or "Square Neck").strip(),
                        sub_product=str(ws_bc.cell(r, 7).value or "SINGLE DRESS").strip(),
                        fabric_composition=str(ws_bc.cell(r, 8).value or "Woven").strip(),
                        fabric_type=str(ws_bc.cell(r, 9).value or "Woven").strip(),
                        no_of_components=safe_int(ws_bc.cell(r, 10).value, 1),
                        colour=str(ws_bc.cell(r, 11).value or "Multi").strip(),
                        sizing=str(ws_bc.cell(r, 12).value or "XXL").strip(),
                        num_size_per_set=safe_int(ws_bc.cell(r, 13).value, 1),
                        individual_barcode=sku,
                        purchase_rate=p_rate,
                        profit_margin=p_margin,
                        meesho_price=m_price,
                        wrong_return_price=w_price,
                        mrp_pcs=mrp_p,
                        mrp_set=mrp_s,
                        pack_barcode=pack_str,
                        image_url=str(m_data.get("image_url")).strip() if m_data.get("image_url") else None,
                        image_url_2=str(m_data.get("image_url_2")).strip() if m_data.get("image_url_2") else None,
                        image_url_3=str(m_data.get("image_url_3")).strip() if m_data.get("image_url_3") else None,
                        image_url_4=str(m_data.get("image_url_4")).strip() if m_data.get("image_url_4") else None,
                        hsn_id=str(m_data.get("hsn_id") or "620821").strip(),
                        gst_pct=safe_float(m_data.get("gst_pct"), 5.0),
                        net_weight_gms=safe_int(m_data.get("net_weight_gms"), 285),
                        description=str(m_data.get("description")).strip() if m_data.get("description") else None,
                        is_active=True,
                        # Complete Meesho template attributes
                        product_name=str(m_data.get("product_name")).strip() if m_data.get("product_name") else None,
                        inventory=safe_int(m_data.get("inventory"), 10),
                        country_of_origin=str(m_data.get("country_of_origin") or "India").strip(),
                        manufacturer_name=str(m_data.get("manufacturer_name") or "Pegasus Creation").strip(),
                        manufacturer_address=str(m_data.get("manufacturer_address") or "Prasanta Apartment, Check Post").strip(),
                        manufacturer_pincode=str(m_data.get("manufacturer_pincode") or "700125").strip(),
                        packer_name=str(m_data.get("packer_name") or "Divine Enterprise").strip(),
                        packer_address=str(m_data.get("packer_address") or "Prasanta Apartment, Check Post").strip(),
                        packer_pincode=str(m_data.get("packer_pincode") or "700125").strip(),
                        importer_name=str(m_data.get("importer_name")).strip() if m_data.get("importer_name") else None,
                        importer_address=str(m_data.get("importer_address")).strip() if m_data.get("importer_address") else None,
                        importer_pincode=str(m_data.get("importer_pincode")).strip() if m_data.get("importer_pincode") else None,
                        add_ons=str(m_data.get("add_ons") or "No Add Ons").strip(),
                        fabric=str(m_data.get("fabric") or "Cotton").strip(),
                        fit_type=str(m_data.get("fit_type") or "Dress").strip(),
                        generic_name=str(m_data.get("generic_name") or "Maxi").strip(),
                        net_quantity=str(m_data.get("net_quantity") or "1").strip(),
                        bust_size=str(m_data.get("bust_size") or "42").strip(),
                        length_size=str(m_data.get("length_size") or "54").strip(),
                        sku_id=str(m_data.get("sku_id") or sku).strip(),
                        brand_name=str(m_data.get("brand_name")).strip() if m_data.get("brand_name") else None,
                        group_id=str(m_data.get("group_id")).strip() if m_data.get("group_id") else None,
                        ean_upc=str(m_data.get("ean_upc")).strip() if m_data.get("ean_upc") else None,
                        brand=str(m_data.get("brand")).strip() if m_data.get("brand") else None,
                        length=str(m_data.get("length") or "Maxi").strip(),
                        neck=str(m_data.get("neck") or ws_bc.cell(r, 6).value or "Square Neck").strip(),
                        occasion=str(m_data.get("occasion") or "Everyday").strip(),
                        pattern=str(m_data.get("pattern") or "Printed").strip(),
                        pockets=str(m_data.get("pockets") or "No Pocket").strip(),
                        print_type=str(m_data.get("print_type") or "Botanical").strip(),
                        sleeve_length=str(m_data.get("sleeve_length") or ws_bc.cell(r, 5).value or "Sleeveless").strip(),
                        surface_styling=str(m_data.get("surface_styling") or "Pleated Or Gathered").strip(),
                        hip_size=str(m_data.get("hip_size") or "44").strip(),
                        waist_size=str(m_data.get("waist_size") or "36").strip(),
                    )
                    db.add(product)
                db.commit()

        # Ingest Logistic.xlsx
        if not existing_proc and logistic_path.exists():
            wb = openpyxl.load_workbook(logistic_path, data_only=True)
            if "Transactions" in wb.sheetnames:
                ws = wb["Transactions"]
                last_date = ""
                for row in ws.iter_rows(min_row=2, values_only=True):
                    if not row or not any(row):
                        continue
                    date_val, style_no, inv, rate, total = row[:5] if len(row) >= 5 else (*row, *([None] * (5 - len(row))))
                    
                    if is_summary_row(date_val) or is_summary_row(style_no):
                        continue

                    d_str = format_date(date_val)
                    if d_str:
                        last_date = d_str
                    else:
                        d_str = last_date

                    if not style_no:
                        continue

                    inv_int = safe_int(inv, 0)
                    rate_flt = safe_float(rate, 0.0)
                    total_flt = safe_float(total, inv_int * rate_flt)

                    batch = ProcurementBatch(
                        date=d_str,
                        style_no=str(style_no).strip(),
                        inventory=inv_int,
                        purchase_rate=rate_flt,
                        total_value=total_flt,
                    )
                    db.add(batch)
                db.commit()

        # Ingest Sales_Inventory.xlsx
        if not existing_sales and sales_path.exists():
            wb_sales = openpyxl.load_workbook(sales_path, data_only=True)

            # 1. Sales Sheet
            if "Sales" in wb_sales.sheetnames:
                ws = wb_sales["Sales"]
                last_date = ""
                for row in ws.iter_rows(min_row=2, values_only=True):
                    if not row or not any(row):
                        continue
                    sl_no, date_val, style_no, qty, price, rev, cogs, profit, margin, ref = (
                        row[:10] if len(row) >= 10 else (*row, *([None] * (10 - len(row))))
                    )
                    if is_summary_row(sl_no) or is_summary_row(date_val) or is_summary_row(style_no):
                        continue
                    
                    d_str = format_date(date_val)
                    if d_str:
                        last_date = d_str
                    else:
                        d_str = last_date

                    if not style_no:
                        continue

                    qty_int = safe_int(qty, 1)
                    price_flt = safe_float(price, 0.0)
                    rev_flt = safe_float(rev, qty_int * price_flt)
                    cogs_flt = safe_float(cogs, 0.0)
                    profit_flt = safe_float(profit, rev_flt - cogs_flt)
                    margin_flt = safe_float(margin, profit_flt / rev_flt if rev_flt > 0 else 0.0)
                    unit_cost = cogs_flt / qty_int if qty_int > 0 else 0.0

                    order = SalesOrder(
                        sl_no=safe_int(sl_no, None),
                        date=d_str,
                        style_no=str(style_no).strip(),
                        quantity_sold=qty_int,
                        selling_price=price_flt,
                        total_revenue=rev_flt,
                        unit_purchase_cost=round(unit_cost, 2),
                        cogs=cogs_flt,
                        profit=profit_flt,
                        profit_margin=margin_flt,
                        reference=str(ref).strip() if ref else None,
                    )
                    db.add(order)

            # 2. RTO Tracker
            if "RTO Tracker" in wb_sales.sheetnames:
                ws = wb_sales["RTO Tracker"]
                for row in ws.iter_rows(min_row=2, values_only=True):
                    if not row or not any(row):
                        continue
                    rto_id, date_val, style_no, qty, price, rev, fee, status, rec_d, rest_d, track, notes = (
                        row[:12] if len(row) >= 12 else (*row, *([None] * (12 - len(row))))
                    )
                    if is_summary_row(rto_id) or is_summary_row(date_val) or not rto_id:
                        continue
                    
                    rto = RTOPipeline(
                        rto_id=str(rto_id).strip(),
                        date=format_date(date_val),
                        style_no=str(style_no).strip() if style_no else "",
                        quantity=safe_int(qty, 1),
                        sale_price=safe_float(price, 0.0),
                        reversed_revenue=safe_float(rev, 0.0),
                        courier_fee=safe_float(fee, 0.0),
                        status=str(status).strip() if status else "In Transit",
                        received_date=format_date(rec_d) if rec_d else None,
                        restocked_date=format_date(rest_d) if rest_d else None,
                        tracking_no=str(track).strip() if track else None,
                        notes=str(notes).strip() if notes else None,
                    )
                    db.add(rto)

            # 3. Customer Returns
            if "Customer Returns" in wb_sales.sheetnames:
                ws = wb_sales["Customer Returns"]
                for row in ws.iter_rows(min_row=2, values_only=True):
                    if not row or not any(row):
                        continue
                    ret_id, date_val, style_no, qty, refund, fee, p_reas, s_reas, status, rec_d, rest_d, awb, *extra = (
                        row if len(row) >= 12 else (*row, *([None] * (12 - len(row))))
                    )
                    if is_summary_row(ret_id) or is_summary_row(date_val) or not ret_id:
                        continue
                    
                    ret = CustomerReturn(
                        return_id=str(ret_id).strip(),
                        date=format_date(date_val),
                        style_no=str(style_no).strip() if style_no else "",
                        quantity=safe_int(qty, 1),
                        refund_amount=safe_float(refund, 0.0),
                        reverse_fee=safe_float(fee, 175.0),
                        primary_reason=str(p_reas).strip() if p_reas else "General Return",
                        secondary_reason=str(s_reas).strip() if s_reas else None,
                        status=str(status).strip() if status else "In Transit",
                        qc_grade=None,
                        received_date=format_date(rec_d) if rec_d else None,
                        restocked_date=format_date(rest_d) if rest_d else None,
                        reverse_awb=str(awb).strip() if awb else None,
                        notes=str(extra[0]).strip() if extra and extra[0] else None,
                    )
                    db.add(ret)

            # 4. Exchanges
            if "Exchanges" in wb_sales.sheetnames:
                ws = wb_sales["Exchanges"]
                for row in ws.iter_rows(min_row=2, values_only=True):
                    if not row or not any(row):
                        continue
                    ex_id, date_val, orig, exch, qty, std_p, fee, amt_r, cogs, profit, p_reas, s_reas, ret_stat, ex_stat, awb, *extra = (
                        row if len(row) >= 15 else (*row, *([None] * (15 - len(row))))
                    )
                    if is_summary_row(ex_id) or is_summary_row(date_val) or not ex_id:
                        continue
                    
                    rec_d = extra[0] if len(extra) > 0 else None
                    rest_d = extra[1] if len(extra) > 1 else None

                    exch_item = ItemExchange(
                        exchange_id=str(ex_id).strip(),
                        date=format_date(date_val),
                        original_style=str(orig).strip() if orig else "",
                        exchanged_style=str(exch).strip() if exch else "",
                        quantity=safe_int(qty, 1),
                        standard_price=safe_float(std_p, 0.0),
                        reverse_fee=safe_float(fee, 175.0),
                        amount_received=safe_float(amt_r, 0.0),
                        cogs=safe_float(cogs, 0.0),
                        profit=safe_float(profit, 0.0),
                        primary_reason=str(p_reas).strip() if p_reas else None,
                        secondary_reason=str(s_reas).strip() if s_reas else None,
                        return_status=str(ret_stat).strip() if ret_stat else "In Transit",
                        exchange_status=str(ex_stat).strip() if ex_stat else "Dispatched",
                        reverse_awb=str(awb).strip() if awb else None,
                        received_date=format_date(rec_d) if rec_d else None,
                        restocked_date=format_date(rest_d) if rest_d else None,
                    )
                    db.add(exch_item)

            # 5. Ad Spend
            if "Ad Spend" in wb_sales.sheetnames:
                ws = wb_sales["Ad Spend"]
                for row in ws.iter_rows(min_row=2, values_only=True):
                    if not row or not any(row):
                        continue
                    date_val, platform, amount, notes = (
                        row[:4] if len(row) >= 4 else (*row, *([None] * (4 - len(row))))
                    )
                    if is_summary_row(date_val) or not date_val:
                        continue
                    
                    ad = AdSpend(
                        date=format_date(date_val),
                        platform=str(platform).strip() if platform else "Other",
                        amount=safe_float(amount, 0.0),
                        notes=str(notes).strip() if notes else None,
                    )
                    db.add(ad)

            # 6. Bank Transactions
            if "Bank Transactions" in wb_sales.sheetnames:
                ws = wb_sales["Bank Transactions"]
                for row in ws.iter_rows(min_row=2, values_only=True):
                    if not row or not any(row):
                        continue
                    sl_no, date_val, b_type, amount, balance = (
                        row[:5] if len(row) >= 5 else (*row, *([None] * (5 - len(row))))
                    )
                    if is_summary_row(sl_no) or is_summary_row(date_val) or not date_val:
                        continue
                    
                    bank = BankTransaction(
                        sl_no=safe_int(sl_no, None),
                        date=format_date(date_val),
                        type=str(b_type).strip() if b_type else "Credited (+)",
                        amount=safe_float(amount, 0.0),
                        running_balance=safe_float(balance, 0.0),
                    )
                    db.add(bank)

            # Audit Log Initial Entry
            audit = ActivityAuditLog(
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                category="SYSTEM",
                action="INITIALIZE",
                summary="System cold-start initialized and seeded from master workbooks",
                status="SUCCESS",
                source="System Seed",
                details="Seeded initial data from Logistic.xlsx and Sales_Inventory.xlsx",
            )
            db.add(audit)
            db.commit()

    finally:
        if close_db:
            db.close()

if __name__ == "__main__":
    init_db()
    print("Database initialization and cold-start seeding completed successfully.")
