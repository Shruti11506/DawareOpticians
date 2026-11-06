from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    unit_price: float = Field(..., ge=0)

class SaleCreate(BaseModel):
    customer_id: int
    items: List[SaleItemCreate] = Field(..., min_length=1)
    discount: Optional[float] = Field(0.00, ge=0)
    tax: Optional[float] = Field(0.00, ge=0)
    initial_payment: Optional[float] = Field(0.00, ge=0)
    payment_method: Optional[str] = Field("CASH", description="CASH, UPI, CARD, or BANK_TRANSFER")

class SaleUpdate(BaseModel):
    payment_status: Optional[str] = None  # 'PAID', 'PARTIAL', 'PENDING'
    discount: Optional[float] = None
    tax: Optional[float] = None
    total_amount: Optional[float] = None
    add_payment_amount: Optional[float] = None
    payment_method: Optional[str] = "UPI"
    notes: Optional[str] = None

class SaleItemResponse(BaseModel):
    sale_item_id: int
    product_id: int
    name: str
    quantity: int
    unit_price: float
    subtotal: float

    model_config = ConfigDict(from_attributes=True)

class SaleResponse(BaseModel):
    sale_id: int
    invoiceNo: str
    customer_id: int
    customerName: str
    customerPhone: Optional[str] = None
    date: Optional[str] = None
    subtotal: float
    discount: float
    tax: float
    grandTotal: float
    total_amount: float
    amountPaid: float
    balanceDue: float
    paymentStatus: str
    items: List[SaleItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
