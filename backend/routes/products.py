from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import get_db
from models.product import Product
from models.category import Category
from models.sale_item import SaleItem
from schemas.product import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("", response_model=List[dict], summary="List inventory products")
def get_products(
    search: Optional[str] = Query(None, description="Search by product name, brand, or model"),
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    low_stock: Optional[bool] = Query(None, description="Filter items with low stock (<= 5)"),
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if category_id:
        query = query.filter(Product.category_id == category_id)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Product.product_name.ilike(search_term),
                Product.brand.ilike(search_term),
                Product.model_number.ilike(search_term),
                Product.description.ilike(search_term)
            )
        )

    if low_stock:
        query = query.filter(Product.stock_quantity <= 5)

    products = query.order_by(Product.product_id.desc()).all()
    return [p.to_dict() for p in products]


@router.get("/{product_id}", summary="Get single product by ID")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found."
        )
    return product.to_dict()


@router.post("", status_code=status.HTTP_201_CREATED, summary="Add new product to catalog")
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    if payload.category_id:
        cat = db.query(Category).filter(Category.category_id == payload.category_id).first()
        if not cat:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category ID {payload.category_id} does not exist."
            )

    new_product = Product(
        product_name=payload.product_name.strip(),
        brand=payload.brand.strip() if payload.brand else None,
        category_id=payload.category_id,
        model_number=payload.model_number.strip() if payload.model_number else None,
        selling_price=payload.selling_price,
        stock_quantity=payload.stock_quantity if payload.stock_quantity is not None else 0,
        description=payload.description.strip() if payload.description else None
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product.to_dict()


@router.put("/{product_id}", summary="Update existing product")
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found."
        )

    if payload.category_id is not None:
        cat = db.query(Category).filter(Category.category_id == payload.category_id).first()
        if not cat:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category ID {payload.category_id} does not exist."
            )
        product.category_id = payload.category_id

    if payload.product_name is not None:
        product.product_name = payload.product_name.strip()
    if payload.brand is not None:
        product.brand = payload.brand.strip() if payload.brand else None
    if payload.model_number is not None:
        product.model_number = payload.model_number.strip() if payload.model_number else None
    if payload.selling_price is not None:
        product.selling_price = payload.selling_price
    if payload.stock_quantity is not None:
        product.stock_quantity = payload.stock_quantity
    if payload.description is not None:
        product.description = payload.description.strip() if payload.description else None

    db.commit()
    db.refresh(product)
    return product.to_dict()


@router.delete("/{product_id}", status_code=status.HTTP_200_OK, summary="Delete product from catalog")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found."
        )

    # Check if product is referenced in sales
    has_sales = db.query(SaleItem).filter(SaleItem.product_id == product_id).first()
    if has_sales:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete product that is referenced in customer sales."
        )

    db.delete(product)
    db.commit()
    return {"message": f"Product {product_id} deleted successfully."}
