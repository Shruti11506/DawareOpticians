from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import get_db
from models.supplier import Supplier
from models.purchase_order import PurchaseOrder
from schemas.supplier import SupplierCreate, SupplierUpdate

router = APIRouter(prefix="/api/suppliers", tags=["Suppliers"])


@router.get("", response_model=List[dict], summary="List all suppliers")
def get_suppliers(
    search: Optional[str] = Query(None, description="Search supplier by name, contact, or city"),
    db: Session = Depends(get_db)
):
    query = db.query(Supplier)
    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Supplier.supplier_name.ilike(s),
                Supplier.contact_person.ilike(s),
                Supplier.city.ilike(s),
                Supplier.phone.ilike(s),
                Supplier.email.ilike(s)
            )
        )
    suppliers = query.order_by(Supplier.supplier_id.desc()).all()
    return [sup.to_dict() for sup in suppliers]


@router.get("/{supplier_id}", summary="Get single supplier")
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    sup = db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()
    if not sup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Supplier with ID {supplier_id} not found."
        )
    return sup.to_dict()


@router.post("", status_code=status.HTTP_201_CREATED, summary="Add new supplier")
def create_supplier(payload: SupplierCreate, db: Session = Depends(get_db)):
    new_sup = Supplier(
        supplier_name=payload.supplier_name.strip(),
        contact_person=payload.contact_person.strip() if payload.contact_person else None,
        phone=payload.phone.strip() if payload.phone else None,
        email=payload.email.strip() if payload.email else None,
        address=payload.address.strip() if payload.address else None,
        city=payload.city.strip() if payload.city else None
    )
    db.add(new_sup)
    db.commit()
    db.refresh(new_sup)
    return new_sup.to_dict()


@router.put("/{supplier_id}", summary="Update supplier details")
def update_supplier(supplier_id: int, payload: SupplierUpdate, db: Session = Depends(get_db)):
    sup = db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()
    if not sup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Supplier with ID {supplier_id} not found."
        )

    for field, val in payload.model_dump(exclude_unset=True).items():
        if val is not None and isinstance(val, str):
            setattr(sup, field, val.strip())
        else:
            setattr(sup, field, val)

    db.commit()
    db.refresh(sup)
    return sup.to_dict()


@router.delete("/{supplier_id}", status_code=status.HTTP_200_OK, summary="Delete supplier")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    sup = db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()
    if not sup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Supplier with ID {supplier_id} not found."
        )

    has_pos = db.query(PurchaseOrder).filter(PurchaseOrder.supplier_id == supplier_id).first()
    if has_pos:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete supplier with linked purchase orders."
        )

    db.delete(sup)
    db.commit()
    return {"message": f"Supplier {supplier_id} deleted successfully."}
