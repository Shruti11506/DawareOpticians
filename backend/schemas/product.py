from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class ProductBase(BaseModel):
    product_name: str = Field(..., max_length=100)
    brand: Optional[str] = Field(None, max_length=100)
    category_id: Optional[int] = None
    model_number: Optional[str] = Field(None, max_length=50)
    selling_price: float = Field(..., ge=0)
    stock_quantity: Optional[int] = Field(0, ge=0)
    description: Optional[str] = Field(None, max_length=255)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    product_name: Optional[str] = Field(None, max_length=100)
    brand: Optional[str] = Field(None, max_length=100)
    category_id: Optional[int] = None
    model_number: Optional[str] = Field(None, max_length=50)
    selling_price: Optional[float] = Field(None, ge=0)
    stock_quantity: Optional[int] = Field(None, ge=0)
    description: Optional[str] = Field(None, max_length=255)

class ProductResponse(ProductBase):
    product_id: int
    category_name: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
