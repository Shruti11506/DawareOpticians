from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.category import Category
from schemas.category import CategoryResponse

router = APIRouter(prefix="/api/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryResponse], summary="Get all product categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.category_id.asc()).all()
