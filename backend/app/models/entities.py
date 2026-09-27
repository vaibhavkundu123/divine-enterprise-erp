from datetime import datetime
from typing import Optional
from sqlalchemy import (
    Column, Integer, Float, String, Text, DateTime, Boolean, ForeignKey
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class ProcurementBatch(Base):
    __tablename__ = "procurement_batches"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    date: Mapped[str] = mapped_column(String(50), index=True)
    style_no: Mapped[str] = mapped_column(String(100), index=True)
    inventory: Mapped[int] = mapped_column(Integer, default=0)
    purchase_rate: Mapped[float] = mapped_column(Float, default=0.0)
    total_value: Mapped[float] = mapped_column(Float, default=0.0)

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date,
            "style_no": self.style_no,
            "inventory": self.inventory,
            "purchase_rate": self.purchase_rate,
            "total_value": self.total_value,
        }

class SalesOrder(Base):
    __tablename__ = "sales_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    sl_no: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    date: Mapped[str] = mapped_column(String(50), index=True)
    style_no: Mapped[str] = mapped_column(String(100), index=True)
    quantity_sold: Mapped[int] = mapped_column(Integer, default=1)
    selling_price: Mapped[float] = mapped_column(Float, default=0.0)
    total_revenue: Mapped[float] = mapped_column(Float, default=0.0)
    unit_purchase_cost: Mapped[float] = mapped_column(Float, default=0.0)
    cogs: Mapped[float] = mapped_column(Float, default=0.0)
    profit: Mapped[float] = mapped_column(Float, default=0.0)
    profit_margin: Mapped[float] = mapped_column(Float, default=0.0)
    reference: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "sl_no": self.sl_no,
            "date": self.date,
            "style_no": self.style_no,
            "quantity_sold": self.quantity_sold,
            "selling_price": self.selling_price,
            "total_revenue": self.total_revenue,
            "unit_purchase_cost": self.unit_purchase_cost,
            "cogs": self.cogs,
            "profit": self.profit,
            "profit_margin": self.profit_margin,
            "reference": self.reference,
        }

class RTOPipeline(Base):
    __tablename__ = "rto_pipeline"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    rto_id: Mapped[str] = mapped_column(String(50), index=True)
    date: Mapped[str] = mapped_column(String(50), index=True)
    style_no: Mapped[str] = mapped_column(String(100), index=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    sale_price: Mapped[float] = mapped_column(Float, default=0.0)
    reversed_revenue: Mapped[float] = mapped_column(Float, default=0.0)
    courier_fee: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(50), default="In Transit", index=True)  # In Transit, Received, Restocked, Damaged
    received_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    restocked_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    tracking_no: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "rto_id": self.rto_id,
            "date": self.date,
            "style_no": self.style_no,
            "quantity": self.quantity,
            "sale_price": self.sale_price,
            "reversed_revenue": self.reversed_revenue,
            "courier_fee": self.courier_fee,
            "status": self.status,
            "received_date": self.received_date,
            "restocked_date": self.restocked_date,
            "tracking_no": self.tracking_no,
            "notes": self.notes,
        }

class CustomerReturn(Base):
    __tablename__ = "customer_returns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    return_id: Mapped[str] = mapped_column(String(50), index=True)
    date: Mapped[str] = mapped_column(String(50), index=True)
    style_no: Mapped[str] = mapped_column(String(100), index=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    refund_amount: Mapped[float] = mapped_column(Float, default=0.0)
    reverse_fee: Mapped[float] = mapped_column(Float, default=0.0)
    primary_reason: Mapped[str] = mapped_column(String(150), default="Size Too Small / Fit Issue")
    secondary_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="In Transit", index=True)  # In Transit, Intake, Restocked, Damaged, Dispute
    qc_grade: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # Grade A, Grade B, Damaged, Dispute
    received_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    restocked_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    reverse_awb: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "return_id": self.return_id,
            "date": self.date,
            "style_no": self.style_no,
            "quantity": self.quantity,
            "refund_amount": self.refund_amount,
            "reverse_fee": self.reverse_fee,
            "primary_reason": self.primary_reason,
            "secondary_reason": self.secondary_reason,
            "status": self.status,
            "qc_grade": self.qc_grade,
            "received_date": self.received_date,
            "restocked_date": self.restocked_date,
            "reverse_awb": self.reverse_awb,
            "notes": self.notes,
        }

class ItemExchange(Base):
    __tablename__ = "item_exchanges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    exchange_id: Mapped[str] = mapped_column(String(50), index=True)
    date: Mapped[str] = mapped_column(String(50), index=True)
    original_style: Mapped[str] = mapped_column(String(100), index=True)
    exchanged_style: Mapped[str] = mapped_column(String(100), index=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    standard_price: Mapped[float] = mapped_column(Float, default=0.0)
    reverse_fee: Mapped[float] = mapped_column(Float, default=0.0)
    amount_received: Mapped[float] = mapped_column(Float, default=0.0)
    cogs: Mapped[float] = mapped_column(Float, default=0.0)
    profit: Mapped[float] = mapped_column(Float, default=0.0)
    primary_reason: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    secondary_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    return_status: Mapped[str] = mapped_column(String(50), default="In Transit", index=True)  # In Transit, Intake, Restocked, Damaged
    exchange_status: Mapped[str] = mapped_column(String(50), default="Dispatched")
    reverse_awb: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    received_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    restocked_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "exchange_id": self.exchange_id,
            "date": self.date,
            "original_style": self.original_style,
            "exchanged_style": self.exchanged_style,
            "quantity": self.quantity,
            "standard_price": self.standard_price,
            "reverse_fee": self.reverse_fee,
            "amount_received": self.amount_received,
            "cogs": self.cogs,
            "profit": self.profit,
            "primary_reason": self.primary_reason,
            "secondary_reason": self.secondary_reason,
            "return_status": self.return_status,
            "exchange_status": self.exchange_status,
            "reverse_awb": self.reverse_awb,
            "received_date": self.received_date,
            "restocked_date": self.restocked_date,
        }

class AdSpend(Base):
    __tablename__ = "ad_spends"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    date: Mapped[str] = mapped_column(String(50), index=True)
    platform: Mapped[str] = mapped_column(String(100), index=True)
    amount: Mapped[float] = mapped_column(Float, default=0.0)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date,
            "platform": self.platform,
            "amount": self.amount,
            "notes": self.notes,
        }

class BankTransaction(Base):
    __tablename__ = "bank_transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    sl_no: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    date: Mapped[str] = mapped_column(String(50), index=True)
    type: Mapped[str] = mapped_column(String(50))  # Credited (+) or Debited (-)
    amount: Mapped[float] = mapped_column(Float, default=0.0)
    running_balance: Mapped[float] = mapped_column(Float, default=0.0)

    def to_dict(self):
        return {
            "id": self.id,
            "sl_no": self.sl_no,
            "date": self.date,
            "type": self.type,
            "amount": self.amount,
            "running_balance": self.running_balance,
        }

class ActivityAuditLog(Base):
    __tablename__ = "activity_audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    timestamp: Mapped[str] = mapped_column(String(50), index=True)
    category: Mapped[str] = mapped_column(String(50), index=True)  # SALE, AD_SPEND, RTO, CUSTOMER_RETURN, EXCHANGE, STOCK, SYNC, EXPORT, SYSTEM, BANK
    action: Mapped[str] = mapped_column(String(50))  # CREATE, UPDATE, DELETE, RECEIVE, RESTOCK, DAMAGE, GRADE, CLEAR
    summary: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(50), default="SUCCESS")  # SUCCESS, WARNING, DANGER, INFO
    source: Mapped[str] = mapped_column(String(50), default="Web App")
    details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp,
            "category": self.category,
            "action": self.action,
            "summary": self.summary,
            "status": self.status,
            "source": self.source,
            "details": self.details,
        }

class ProductCatalog(Base):
    __tablename__ = "product_catalog"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    sl_no: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    season: Mapped[str] = mapped_column(String(50), default="Everyday")
    style_no: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(100), default="Nighty")
    sub_category: Mapped[str] = mapped_column(String(100), default="Sleeveless")
    product_type: Mapped[str] = mapped_column(String(100), default="Square Neck")
    sub_product: Mapped[str] = mapped_column(String(100), default="SINGLE DRESS")
    fabric_composition: Mapped[str] = mapped_column(String(100), default="Woven")
    fabric_type: Mapped[str] = mapped_column(String(100), default="Woven")
    no_of_components: Mapped[int] = mapped_column(Integer, default=1)
    colour: Mapped[str] = mapped_column(String(50), index=True)
    sizing: Mapped[str] = mapped_column(String(20), default="XXL")
    individual_barcode: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    purchase_rate: Mapped[float] = mapped_column(Float, default=0.0)
    profit_margin: Mapped[float] = mapped_column(Float, default=0.18)
    meesho_price: Mapped[float] = mapped_column(Float, default=0.0)
    wrong_return_price: Mapped[float] = mapped_column(Float, default=0.0)
    mrp_pcs: Mapped[float] = mapped_column(Float, default=499.0)
    mrp_set: Mapped[float] = mapped_column(Float, default=499.0)
    pack_barcode: Mapped[str] = mapped_column(String(64), index=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    image_url_2: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    image_url_3: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    image_url_4: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    hsn_id: Mapped[str] = mapped_column(String(20), default="620821")
    gst_pct: Mapped[float] = mapped_column(Float, default=5.0)
    net_weight_gms: Mapped[int] = mapped_column(Integer, default=285)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # --- Barcode Master additional fields ---
    num_size_per_set: Mapped[int] = mapped_column(Integer, default=1)

    # --- Meesho Template complete specification fields ---
    product_name: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    inventory: Mapped[int] = mapped_column(Integer, default=10)
    country_of_origin: Mapped[str] = mapped_column(String(100), default="India")
    manufacturer_name: Mapped[str] = mapped_column(String(200), default="Pegasus Creation")
    manufacturer_address: Mapped[str] = mapped_column(String(500), default="Prasanta Apartment, Check Post")
    manufacturer_pincode: Mapped[str] = mapped_column(String(20), default="700125")
    packer_name: Mapped[str] = mapped_column(String(200), default="Divine Enterprise")
    packer_address: Mapped[str] = mapped_column(String(500), default="Prasanta Apartment, Check Post")
    packer_pincode: Mapped[str] = mapped_column(String(20), default="700125")
    importer_name: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    importer_address: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    importer_pincode: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    add_ons: Mapped[str] = mapped_column(String(100), default="No Add Ons")
    fabric: Mapped[str] = mapped_column(String(100), default="Cotton")
    fit_type: Mapped[str] = mapped_column(String(100), default="Dress")
    generic_name: Mapped[str] = mapped_column(String(100), default="Maxi")
    net_quantity: Mapped[str] = mapped_column(String(50), default="1")
    bust_size: Mapped[str] = mapped_column(String(50), default="42")
    length_size: Mapped[str] = mapped_column(String(50), default="54")
    sku_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    brand_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    group_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    ean_upc: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    brand: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    length: Mapped[str] = mapped_column(String(100), default="Maxi")
    neck: Mapped[str] = mapped_column(String(100), default="Square Neck")
    occasion: Mapped[str] = mapped_column(String(100), default="Everyday")
    pattern: Mapped[str] = mapped_column(String(100), default="Printed")
    pockets: Mapped[str] = mapped_column(String(100), default="No Pocket")
    print_type: Mapped[str] = mapped_column(String(100), default="Botanical")
    sleeve_length: Mapped[str] = mapped_column(String(100), default="Sleeveless")
    surface_styling: Mapped[str] = mapped_column(String(100), default="Pleated Or Gathered")
    hip_size: Mapped[str] = mapped_column(String(50), default="44")
    waist_size: Mapped[str] = mapped_column(String(50), default="36")

    def to_dict(self):
        thumb_url = None
        if self.image_url and self.image_url.startswith("/Pic/"):
            thumb_path = self.image_url.replace("/Pic/", "/Pic_thumbs/")
            dot_idx = thumb_path.rfind(".")
            if dot_idx != -1:
                thumb_url = thumb_path[:dot_idx] + ".jpg"
            else:
                thumb_url = thumb_path + ".jpg"

        return {
            "id": self.id,
            "sl_no": self.sl_no,
            "season": self.season,
            "style_no": self.style_no,
            "category": self.category,
            "sub_category": self.sub_category,
            "product_type": self.product_type,
            "sub_product": self.sub_product,
            "fabric_composition": self.fabric_composition,
            "fabric_type": self.fabric_type,
            "no_of_components": self.no_of_components,
            "colour": self.colour,
            "sizing": self.sizing,
            "num_size_per_set": self.num_size_per_set,
            "individual_barcode": self.individual_barcode,
            "purchase_rate": self.purchase_rate,
            "profit_margin": self.profit_margin,
            "meesho_price": self.meesho_price,
            "wrong_return_price": self.wrong_return_price or (self.meesho_price - 22 if self.meesho_price > 22 else 0),
            "mrp_pcs": self.mrp_pcs,
            "mrp_set": self.mrp_set,
            "pack_barcode": self.pack_barcode,
            "image_url": self.image_url,
            "thumbnail_url": thumb_url or self.image_url,
            "image_url_2": self.image_url_2,
            "image_url_3": self.image_url_3,
            "image_url_4": self.image_url_4,
            "hsn_id": self.hsn_id,
            "gst_pct": self.gst_pct,
            "net_weight_gms": self.net_weight_gms,
            "description": self.description,
            "is_active": self.is_active,
            # Meesho full fields
            "product_name": self.product_name,
            "inventory": self.inventory,
            "country_of_origin": self.country_of_origin,
            "manufacturer_name": self.manufacturer_name,
            "manufacturer_address": self.manufacturer_address,
            "manufacturer_pincode": self.manufacturer_pincode,
            "packer_name": self.packer_name,
            "packer_address": self.packer_address,
            "packer_pincode": self.packer_pincode,
            "importer_name": self.importer_name,
            "importer_address": self.importer_address,
            "importer_pincode": self.importer_pincode,
            "add_ons": self.add_ons,
            "fabric": self.fabric,
            "fit_type": self.fit_type,
            "generic_name": self.generic_name,
            "net_quantity": self.net_quantity,
            "bust_size": self.bust_size,
            "length_size": self.length_size,
            "sku_id": self.sku_id or self.individual_barcode,
            "brand_name": self.brand_name,
            "group_id": self.group_id,
            "ean_upc": self.ean_upc,
            "brand": self.brand,
            "length": self.length,
            "neck": self.neck or self.product_type,
            "occasion": self.occasion,
            "pattern": self.pattern,
            "pockets": self.pockets,
            "print_type": self.print_type,
            "sleeve_length": self.sleeve_length or self.sub_category,
            "surface_styling": self.surface_styling,
            "hip_size": self.hip_size,
            "waist_size": self.waist_size,
        }

