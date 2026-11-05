from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field

class PrescriptionBase(BaseModel):
    customer_id: int
    right_sph: Optional[float] = None
    right_cyl: Optional[float] = None
    right_axis: Optional[int] = None
    left_sph: Optional[float] = None
    left_cyl: Optional[float] = None
    left_axis: Optional[int] = None
    add_power: Optional[float] = None
    pupillary_distance: Optional[float] = None
    optometrist_name: Optional[str] = Field("Shruti Daware", max_length=100)
    prescription_date: Optional[date] = None
    notes: Optional[str] = Field(None, max_length=255)

class PrescriptionCreate(PrescriptionBase):
    pass

class PrescriptionUpdate(BaseModel):
    right_sph: Optional[float] = None
    right_cyl: Optional[float] = None
    right_axis: Optional[int] = None
    left_sph: Optional[float] = None
    left_cyl: Optional[float] = None
    left_axis: Optional[int] = None
    add_power: Optional[float] = None
    pupillary_distance: Optional[float] = None
    optometrist_name: Optional[str] = None
    prescription_date: Optional[date] = None
    notes: Optional[str] = None

class PrescriptionResponse(PrescriptionBase):
    prescription_id: int
    customer_name: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
