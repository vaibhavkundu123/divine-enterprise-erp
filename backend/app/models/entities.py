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
