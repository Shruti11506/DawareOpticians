from typing import Optional
from datetime import date
from pydantic import BaseModel, ConfigDict, Field

class RepairCreate(BaseModel):
    customer_id: int
    product_id: Optional[int] = None
    repair_description: str = Field(..., max_length=255)
    repair_cost: Optional[float] = Field(0.00, ge=0)
    received_date: date
    expected_delivery_date: Optional[date] = None
    repair_status: Optional[str] = Field("RECEIVED", description="RECEIVED, IN_PROGRESS, COMPLETED, DELIVERED, CANCELLED")
    notes: Optional[str] = Field(None, max_length=255)

class RepairUpdate(BaseModel):
    repair_description: Optional[str] = Field(None, max_length=255)
    repair_cost: Optional[float] = Field(None, ge=0)
    expected_delivery_date: Optional[date] = None
    actual_delivery_date: Optional[date] = None
    repair_status: Optional[str] = None
    notes: Optional[str] = None

class RepairResponse(BaseModel):
    repair_id: int
    repairTicket: str
    customer_id: int
    customerName: str
    customerPhone: Optional[str] = None
    product_id: Optional[int] = None
    itemDetails: str
    repair_description: str
    issue: str
    repair_cost: float
    cost: float
    received_date: Optional[str] = None
    receivedDate: Optional[str] = None
    expected_delivery_date: Optional[str] = None
    expectedDelivery: Optional[str] = None
    actual_delivery_date: Optional[str] = None
    repair_status: str
    status: str
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
