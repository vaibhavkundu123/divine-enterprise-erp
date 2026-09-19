from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

# ---------------------------------------------------------
# Procurement Schemas
# ---------------------------------------------------------
class ProcurementBatchBase(BaseModel):
    date: str
    style_no: str
    inventory: int
    purchase_rate: float
    total_value: Optional[float] = None

class ProcurementBatchCreate(ProcurementBatchBase):
    pass

class ProcurementBatchUpdate(BaseModel):
    date: Optional[str] = None
    style_no: Optional[str] = None
    inventory: Optional[int] = None
    purchase_rate: Optional[float] = None
    total_value: Optional[float] = None

class ProcurementBatchOut(ProcurementBatchBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# ---------------------------------------------------------
# Sales Schemas
# ---------------------------------------------------------
class SalesOrderBase(BaseModel):
    date: str
    style_no: str
    quantity_sold: int = 1
    selling_price: Optional[float] = None
    total_revenue: Optional[float] = None
    reference: Optional[str] = "Sale"

class SalesOrderCreate(SalesOrderBase):
    pass

class SalesOrderUpdate(BaseModel):
    date: Optional[str] = None
    style_no: Optional[str] = None
    quantity_sold: Optional[int] = None
    selling_price: Optional[float] = None
    total_revenue: Optional[float] = None
    reference: Optional[str] = None

class SalesOrderOut(BaseModel):
    id: int
    sl_no: Optional[int] = None
    date: str
    style_no: str
    quantity_sold: int
    selling_price: float
    total_revenue: float
    unit_purchase_cost: float
    cogs: float
    profit: float
    profit_margin: float
    reference: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class SalesPreviewRequest(BaseModel):
    style_no: str
    quantity_sold: int = 1
    selling_price: Optional[float] = None
    total_revenue: Optional[float] = None

class SalesPreviewResponse(BaseModel):
    style_no: str
    quantity_sold: int
    selling_price: float
    total_revenue: float
    unit_purchase_cost: float
    cogs: float
    profit: float
    profit_margin: float
    stock_on_hand: int

# ---------------------------------------------------------
# RTO Schemas
# ---------------------------------------------------------
class RTOBase(BaseModel):
    date: str
    style_no: str
    quantity: int = 1
    sale_price: float
    reversed_revenue: Optional[float] = None
    courier_fee: float = 0.0
    status: str = "In Transit"
    tracking_no: Optional[str] = None
    notes: Optional[str] = None

class RTOCreate(RTOBase):
    rto_id: Optional[str] = None

class RTOUpdate(BaseModel):
    date: Optional[str] = None
    style_no: Optional[str] = None
    quantity: Optional[int] = None
    sale_price: Optional[float] = None
    reversed_revenue: Optional[float] = None
    courier_fee: Optional[float] = None
    status: Optional[str] = None
    tracking_no: Optional[str] = None
    notes: Optional[str] = None
    received_date: Optional[str] = None
    restocked_date: Optional[str] = None

class RTOOut(RTOBase):
    id: int
    rto_id: str
    received_date: Optional[str] = None
    restocked_date: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# ---------------------------------------------------------
# Customer Returns Schemas
# ---------------------------------------------------------
class CustomerReturnBase(BaseModel):
    date: str
    style_no: str
    quantity: int = 1
    refund_amount: float
    reverse_fee: float = 175.0
    primary_reason: str = "Size Too Small / Fit Issue"
    secondary_reason: Optional[str] = None
    status: str = "In Transit"
    qc_grade: Optional[str] = None
    reverse_awb: Optional[str] = None
    notes: Optional[str] = None

class CustomerReturnCreate(CustomerReturnBase):
    return_id: Optional[str] = None

class CustomerReturnUpdate(BaseModel):
    date: Optional[str] = None
    style_no: Optional[str] = None
    quantity: Optional[int] = None
    refund_amount: Optional[float] = None
    reverse_fee: Optional[float] = None
    primary_reason: Optional[str] = None
    secondary_reason: Optional[str] = None
    status: Optional[str] = None
    qc_grade: Optional[str] = None
    reverse_awb: Optional[str] = None
    notes: Optional[str] = None
    received_date: Optional[str] = None
    restocked_date: Optional[str] = None

class CustomerReturnOut(CustomerReturnBase):
    id: int
    return_id: str
    received_date: Optional[str] = None
    restocked_date: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# ---------------------------------------------------------
# Item Exchanges Schemas
# ---------------------------------------------------------
class ItemExchangeBase(BaseModel):
    date: str
    original_style: str
    exchanged_style: str
    quantity: int = 1
    standard_price: float
    reverse_fee: float = 175.0
    primary_reason: Optional[str] = None
    secondary_reason: Optional[str] = None
    return_status: str = "In Transit"
    exchange_status: str = "Dispatched"
    reverse_awb: Optional[str] = None

class ItemExchangeCreate(ItemExchangeBase):
    exchange_id: Optional[str] = None

class ItemExchangeUpdate(BaseModel):
    date: Optional[str] = None
    original_style: Optional[str] = None
    exchanged_style: Optional[str] = None
    quantity: Optional[int] = None
    standard_price: Optional[float] = None
    reverse_fee: Optional[float] = None
    primary_reason: Optional[str] = None
    secondary_reason: Optional[str] = None
    return_status: Optional[str] = None
    exchange_status: Optional[str] = None
    reverse_awb: Optional[str] = None
    received_date: Optional[str] = None
    restocked_date: Optional[str] = None

class ItemExchangeOut(ItemExchangeBase):
    id: int
    exchange_id: str
    amount_received: float
    cogs: float
    profit: float
    received_date: Optional[str] = None
    restocked_date: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# ---------------------------------------------------------
# Ad Spend Schemas
# ---------------------------------------------------------
class AdSpendBase(BaseModel):
    date: str
    platform: str
    amount: float
    notes: Optional[str] = None

class AdSpendCreate(AdSpendBase):
    pass

class AdSpendUpdate(BaseModel):
    date: Optional[str] = None
    platform: Optional[str] = None
    amount: Optional[float] = None
    notes: Optional[str] = None

class AdSpendOut(AdSpendBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# ---------------------------------------------------------
# Bank Transaction Schemas
# ---------------------------------------------------------
class BankTransactionBase(BaseModel):
    date: str
    type: str  # Credited (+) or Debited (-)
    amount: float

class BankTransactionCreate(BankTransactionBase):
    pass

class BankTransactionUpdate(BaseModel):
    date: Optional[str] = None
    type: Optional[str] = None
    amount: Optional[float] = None

class BankTransactionOut(BankTransactionBase):
    id: int
    sl_no: Optional[int] = None
    running_balance: float
    model_config = ConfigDict(from_attributes=True)

# ---------------------------------------------------------
# Audit Trail Schemas
# ---------------------------------------------------------
class ActivityAuditLogOut(BaseModel):
    id: int
    timestamp: str
    category: str
    action: str
    summary: str
    status: str
    source: str
    details: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)
