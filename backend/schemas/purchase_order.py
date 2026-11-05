from typing import List, Optional
from datetime import date
from pydantic import BaseModel, ConfigDict, Field

class PurchaseOrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    unit_cost: float = Field(..., ge=0)

class PurchaseOrderCreate(BaseModel):
    supplier_id: int
    order_date: date
    expected_delivery_date: Optional[date] = None
    order_status: Optional[str] = Field("PENDING", description="PENDING, RECEIVED, CANCELLED")
    notes: Optional[str] = Field(None, max_length=255)
    items: List[PurchaseOrderItemCreate] = Field(..., min_length=1)

class PurchaseOrderItemResponse(BaseModel):
    purchase_item_id: int
    product_id: int
    product_name: str
    quantity: int
    unit_cost: float
    subtotal: float

    model_config = ConfigDict(from_attributes=True)

class PurchaseOrderResponse(BaseModel):
    purchase_order_id: int
    poNumber: str
    supplier_id: int
    supplierName: str
    order_date: str
    expected_delivery_date: Optional[str] = None
    total_amount: float
    order_status: str
    notes: Optional[str] = None
    items: List[PurchaseOrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
