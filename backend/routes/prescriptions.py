from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from models.prescription import Prescription
from models.customer import Customer
from schemas.prescription import PrescriptionCreate, PrescriptionUpdate

router = APIRouter(prefix="/api/prescriptions", tags=["Prescriptions"])


@router.get("", response_model=List[dict], summary="List all prescriptions")
def get_prescriptions(
    customer_id: Optional[int] = Query(None, description="Filter by customer ID"),
    db: Session = Depends(get_db)
):
    query = db.query(Prescription)
    if customer_id:
        query = query.filter(Prescription.customer_id == customer_id)
    rx_list = query.order_by(Prescription.prescription_id.desc()).all()
    return [r.to_dict() for r in rx_list]


@router.get("/{prescription_id}", summary="Get single prescription by ID")
def get_prescription(prescription_id: int, db: Session = Depends(get_db)):
    rx = db.query(Prescription).filter(Prescription.prescription_id == prescription_id).first()
    if not rx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prescription with ID {prescription_id} not found."
        )
    return rx.to_dict()


@router.post("", status_code=status.HTTP_201_CREATED, summary="Create new prescription")
def create_prescription(payload: PrescriptionCreate, db: Session = Depends(get_db)):
    # Validate customer exists
    customer = db.query(Customer).filter(Customer.Customer_id == payload.customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Customer with ID {payload.customer_id} does not exist."
        )

    new_rx = Prescription(
        customer_id=payload.customer_id,
        right_sph=payload.right_sph,
        right_cyl=payload.right_cyl,
        right_axis=payload.right_axis,
        left_sph=payload.left_sph,
        left_cyl=payload.left_cyl,
        left_axis=payload.left_axis,
        add_power=payload.add_power,
        pupillary_distance=payload.pupillary_distance,
        optometrist_name=payload.optometrist_name or "Shruti Daware",
        prescription_date=payload.prescription_date,
        notes=payload.notes.strip() if payload.notes else None
    )
    db.add(new_rx)
    db.commit()
    db.refresh(new_rx)
    return new_rx.to_dict()


@router.put("/{prescription_id}", summary="Update prescription record")
def update_prescription(prescription_id: int, payload: PrescriptionUpdate, db: Session = Depends(get_db)):
    rx = db.query(Prescription).filter(Prescription.prescription_id == prescription_id).first()
    if not rx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prescription with ID {prescription_id} not found."
        )

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(rx, field, value)

    db.commit()
    db.refresh(rx)
    return rx.to_dict()


@router.delete("/{prescription_id}", status_code=status.HTTP_200_OK, summary="Delete prescription")
def delete_prescription(prescription_id: int, db: Session = Depends(get_db)):
    rx = db.query(Prescription).filter(Prescription.prescription_id == prescription_id).first()
    if not rx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prescription with ID {prescription_id} not found."
        )
    db.delete(rx)
    db.commit()
    return {"message": f"Prescription {prescription_id} deleted successfully."}
