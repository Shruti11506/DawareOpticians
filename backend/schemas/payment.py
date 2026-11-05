from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class PaymentCreate(BaseModel):
    sale_id: int
    amount_paid: float = Field(..., gt=0)
    payment_method: str = Field("CASH", description="CASH, UPI, CARD, BANK_TRANSFER")
    transaction_reference: Optional[str] = Field(None, max_length=100)
    payment_notes: Optional[str] = Field(None, max_length=255)

class PaymentResponse(BaseModel):
    payment_id: int
    sale_id: int
    invoiceNo: str
    customerName: str
    date: Optional[str] = None
    amount: float
    amount_paid: float
    method: str
    payment_method: str
    reference: Optional[str] = None
    transaction_reference: Optional[str] = None
    payment_notes: Optional[str] = None
    status: str = "Completed"

    model_config = ConfigDict(from_attributes=True)
