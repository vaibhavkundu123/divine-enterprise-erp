from datetime import date
from typing import Optional, Literal
from pydantic import BaseModel, Field, field_validator


def get_default_date() -> str:
    return date.today().isoformat()


# ----------------------------------------------------------------------
# 1. Sales Order Schema
# ----------------------------------------------------------------------
class SaleInput(BaseModel):
    date: str = Field(default_factory=get_default_date, description="YYYY-MM-DD format")
    style_no: str = Field(..., min_length=1, description="Product Style SKU (e.g. DE26001G)")
    quantity_sold: int = Field(default=1, ge=1, description="Quantity of units sold")
    selling_price: Optional[float] = Field(None, gt=0, description="Unit selling price")
    total_revenue: Optional[float] = Field(None, gt=0, description="Total order revenue")
    reference: Optional[str] = Field("Sale", description="Order reference or channel (e.g. Shopify #1042)")

    @field_validator("style_no")
    @classmethod
    def clean_style(cls, v: str) -> str:
        return v.strip().upper()


# ----------------------------------------------------------------------
# 2. Procurement Batch Schema
# ----------------------------------------------------------------------
class ProcurementInput(BaseModel):
    date: str = Field(default_factory=get_default_date, description="YYYY-MM-DD format")
    style_no: str = Field(..., min_length=1, description="Product Style SKU")
    inventory: int = Field(..., ge=1, description="Quantity of inward units received")
    purchase_rate: float = Field(..., gt=0, description="Cost price per unit from supplier")
    total_value: Optional[float] = Field(None, gt=0, description="Gross batch value (auto-calculated if omitted)")

    @field_validator("style_no")
    @classmethod
    def clean_style(cls, v: str) -> str:
        return v.strip().upper()


# ----------------------------------------------------------------------
# 3. Courier RTO Pipeline Schema
# ----------------------------------------------------------------------
class RTOInput(BaseModel):
    date: str = Field(default_factory=get_default_date, description="YYYY-MM-DD format")
    style_no: str = Field(..., min_length=1, description="Product Style SKU")
    quantity: int = Field(default=1, ge=1, description="Quantity of returned courier units")
    sale_price: float = Field(..., gt=0, description="Original sale price of the order")
    courier_fee: float = Field(default=0.0, ge=0.0, description="Shipping/courier penalty fee")
    tracking_no: Optional[str] = Field(None, description="Courier AWB or tracking number")
    status: Literal["In Transit", "Received", "Restocked", "Damaged"] = "In Transit"
    notes: Optional[str] = Field(None, description="Operational notes")

    @field_validator("style_no")
    @classmethod
    def clean_style(cls, v: str) -> str:
        return v.strip().upper()


# ----------------------------------------------------------------------
# 4. Customer Returns Schema
# ----------------------------------------------------------------------
class CustomerReturnInput(BaseModel):
    date: str = Field(default_factory=get_default_date, description="YYYY-MM-DD format")
    style_no: str = Field(..., min_length=1, description="Product Style SKU")
    quantity: int = Field(default=1, ge=1, description="Units returned")
    refund_amount: float = Field(..., ge=0, description="Amount refunded to customer")
    reverse_fee: float = Field(default=175.0, ge=0, description="Reverse courier freight fee")
    primary_reason: str = Field(default="Size Too Small / Fit Issue", description="Primary reason for return")
    secondary_reason: Optional[str] = Field(None, description="Detailed customer comments")
    reverse_awb: Optional[str] = Field(None, description="Reverse tracking AWB number")
    status: Literal["In Transit", "Received", "Restocked", "Damaged"] = "In Transit"
    qc_grade: Optional[Literal["Grade A", "Grade B", "Damaged"]] = None
    notes: Optional[str] = Field(None, description="Operational notes")

    @field_validator("style_no")
    @classmethod
    def clean_style(cls, v: str) -> str:
        return v.strip().upper()


# ----------------------------------------------------------------------
# 5. Item Exchanges Schema
# ----------------------------------------------------------------------
class ItemExchangeInput(BaseModel):
    date: str = Field(default_factory=get_default_date, description="YYYY-MM-DD format")
    original_style: str = Field(..., min_length=1, description="Returned SKU")
    exchanged_style: str = Field(..., min_length=1, description="Replacement SKU sent to customer")
    quantity: int = Field(default=1, ge=1, description="Number of items exchanged")
    standard_price: float = Field(..., gt=0, description="Catalog price of replacement unit")
    reverse_fee: float = Field(default=175.0, ge=0, description="Exchange shipping fee")
    primary_reason: Optional[str] = Field("Size Exchange", description="Reason for exchange")
    secondary_reason: Optional[str] = Field(None, description="Detailed notes")
    reverse_awb: Optional[str] = Field(None, description="Courier tracking code")
    return_status: str = Field("In Transit", description="Status of incoming returned unit")
    exchange_status: str = Field("Dispatched", description="Status of outgoing replacement unit")

    @field_validator("original_style", "exchanged_style")
    @classmethod
    def clean_styles(cls, v: str) -> str:
        return v.strip().upper()


# ----------------------------------------------------------------------
# 6. Marketing Ad Spend Schema
# ----------------------------------------------------------------------
class AdSpendInput(BaseModel):
    date: str = Field(default_factory=get_default_date, description="YYYY-MM-DD format")
    platform: str = Field(..., min_length=1, description="Platform: Meta Ads, Google Ads, TikTok, etc.")
    amount: float = Field(..., gt=0, description="Ad spend amount")
    notes: Optional[str] = Field(None, description="Campaign identifier or notes")


# ----------------------------------------------------------------------
# 7. Bank Treasury Schema
# ----------------------------------------------------------------------
class BankTransactionInput(BaseModel):
    date: str = Field(default_factory=get_default_date, description="YYYY-MM-DD format")
    type: Literal["Credit", "Debit"] = Field(..., description="Credit (+) or Debit (-)")
    amount: float = Field(..., gt=0, description="Transaction monetary amount")
