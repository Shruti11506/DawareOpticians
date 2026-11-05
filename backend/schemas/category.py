from typing import Optional
from pydantic import BaseModel, ConfigDict

class CategoryResponse(BaseModel):
    category_id: int
    category_name: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
