from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import get_db
from models.repair import Repair
from models.customer import Customer
from models.product import Product
from schemas.repair import RepairCreate, RepairUpdate

router = APIRouter(prefix="/api/repairs", tags=["Repairs & Services"])


@router.get("", response_model=List[dict], summary="List all repair jobs")
def get_repairs(
    repair_status: Optional[str] = Query(None, description="RECEIVED, IN_PROGRESS, COMPLETED, DELIVERED, CANCELLED"),
    customer_id: Optional[int] = Query(None, description="Filter by customer ID"),
    db: Session = Depends(get_db)
):
    query = db.query(Repair)
    if repair_status:
        query = query.filter(Repair.repair_status == repair_status.upper())
    if customer_id:
        query = query.filter(Repair.customer_id == customer_id)

    repairs = query.order_by(Repair.repair_id.desc()).all()
    return [r.to_dict() for r in repairs]


@router.get("/{repair_id}", summary="Get repair ticket details")
def get_repair(repair_id: int, db: Session = Depends(get_db)):
    repair = db.query(Repair).filter(Repair.repair_id == repair_id).first()
    if not repair:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repair job {repair_id} not found."
        )
    return repair.to_dict()


@router.post("", status_code=status.HTTP_201_CREATED, summary="Create new repair ticket")
def create_repair(payload: RepairCreate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.Customer_id == payload.customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Customer with ID {payload.customer_id} does not exist."
        )

    if payload.product_id:
        product = db.query(Product).filter(Product.product_id == payload.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product with ID {payload.product_id} does not exist."
            )

    new_repair = Repair(
        customer_id=payload.customer_id,
        product_id=payload.product_id,
        repair_description=payload.repair_description.strip(),
        repair_cost=payload.repair_cost or 0.00,
        received_date=payload.received_date,
        expected_delivery_date=payload.expected_delivery_date,
        repair_status=payload.repair_status.upper() if payload.repair_status else "RECEIVED",
        notes=payload.notes.strip() if payload.notes else None
    )
    db.add(new_repair)
    db.commit()
    db.refresh(new_repair)
    return new_repair.to_dict()


@router.put("/{repair_id}", summary="Update repair ticket status / details")
def update_repair(repair_id: int, payload: RepairUpdate, db: Session = Depends(get_db)):
    repair = db.query(Repair).filter(Repair.repair_id == repair_id).first()
    if not repair:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repair job {repair_id} not found."
        )

    for field, val in payload.model_dump(exclude_unset=True).items():
        if field == "repair_status" and val:
            setattr(repair, field, val.upper().strip())
        elif val is not None and isinstance(val, str):
            setattr(repair, field, val.strip())
        else:
            setattr(repair, field, val)

    db.commit()
    db.refresh(repair)
    return repair.to_dict()


@router.delete("/{repair_id}", status_code=status.HTTP_200_OK, summary="Delete repair ticket")
def delete_repair(repair_id: int, db: Session = Depends(get_db)):
    repair = db.query(Repair).filter(Repair.repair_id == repair_id).first()
    if not repair:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repair job {repair_id} not found."
        )
    db.delete(repair)
    db.commit()
    return {"message": f"Repair ticket {repair_id} deleted successfully."}
