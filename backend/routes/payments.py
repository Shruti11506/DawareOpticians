from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.payment import Payment
from models.sale import Sale
from schemas.payment import PaymentCreate

router = APIRouter(prefix="/api/payments", tags=["Payments"])


@router.get("", response_model=List[dict], summary="List all payments recorded")
def get_payments(
    sale_id: Optional[int] = Query(None, description="Filter by sale invoice ID"),
    db: Session = Depends(get_db)
):
    query = db.query(Payment)
    if sale_id:
        query = query.filter(Payment.sale_id == sale_id)
    payments = query.order_by(Payment.payment_id.desc()).all()
    return [p.to_dict() for p in payments]


@router.post("", status_code=status.HTTP_201_CREATED, summary="Record a new payment for a sale")
def record_payment(payload: PaymentCreate, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.sale_id == payload.sale_id).first()
    if not sale:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sale with ID {payload.sale_id} not found."
        )

    # Valid method check
    valid_methods = ["CASH", "UPI", "CARD", "BANK_TRANSFER"]
    method = payload.payment_method.upper().strip()
    if method not in valid_methods:
        method = "CASH"

    try:
        new_payment = Payment(
            sale_id=payload.sale_id,
            amount_paid=payload.amount_paid,
            payment_method=method,
            transaction_reference=payload.transaction_reference.strip() if payload.transaction_reference else None,
            payment_notes=payload.payment_notes.strip() if payload.payment_notes else None
        )
        db.add(new_payment)
        db.flush()

        # Recalculate total paid on this sale
        total_paid = db.query(func.coalesce(func.sum(Payment.amount_paid), 0.0)).filter(Payment.sale_id == sale.sale_id).scalar()
        grand_total = float(sale.total_amount or 0.0)

        if float(total_paid) >= grand_total:
            sale.payment_status = "PAID"
        elif float(total_paid) > 0:
            sale.payment_status = "PARTIAL"
        else:
            sale.payment_status = "PENDING"

        db.commit()
        db.refresh(new_payment)
        return new_payment.to_dict()

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record payment: {str(e)}"
        )
