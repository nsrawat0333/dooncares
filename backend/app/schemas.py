from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BookingCreate(BaseModel):
    name: str
    phone: str
    date: str
    service_details: Optional[str] = ""

class BookingOut(BaseModel):
    id: int
    booking_id: str
    name: str
    phone: str
    date: str
    service_details: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ReviewCreate(BaseModel):
    name: str
    rating: int
    comment: str

class ReviewOut(BaseModel):
    id: int
    name: str
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True
