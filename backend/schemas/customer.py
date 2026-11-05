from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class CustomerBase(BaseModel):
    full_name: str = Field(..., max_length=100, description="Customer full name")
    phone: Optional[str] = Field(None, max_length=15, description="Contact phone number")
    email: Optional[str] = Field(None, max_length=100, description="Email address")
    address: Optional[str] = Field(None, max_length=200, description="Customer city or street address")

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=15)
    email: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = Field(None, max_length=200)

class CustomerResponse(CustomerBase):
    Customer_id: int
    created_at: Optional[datetime] = None

    @property
    def id(self) -> int:
        return self.Customer_id

    model_config = ConfigDict(from_attributes=True)
