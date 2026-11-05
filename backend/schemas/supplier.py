from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class SupplierBase(BaseModel):
    supplier_name: str = Field(..., max_length=100)
    contact_person: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=15)
    email: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = Field(None, max_length=255)
    city: Optional[str] = Field(None, max_length=50)

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(BaseModel):
    supplier_name: Optional[str] = Field(None, max_length=100)
    contact_person: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=15)
    email: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = Field(None, max_length=255)
    city: Optional[str] = Field(None, max_length=50)

class SupplierResponse(SupplierBase):
    supplier_id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
