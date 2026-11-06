from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.sale import Sale
from models.sale_item import SaleItem
from models.product import Product
from models.customer import Customer
from models.payment import Payment
from models.inventory_movement import InventoryMovement
from schemas.sale import SaleCreate, SaleUpdate

router = APIRouter(prefix="/api/sales", tags=["Sales & Billing"])


@router.get("", response_model=List[dict], summary="List all sales and bills")
def get_sales(
    customer_id: Optional[int] = Query(None, description="Filter by customer ID"),
    payment_status: Optional[str] = Query(None, description="PAID, PARTIAL, or PENDING"),
    db: Session = Depends(get_db)
):
    query = db.query(Sale)
    if customer_id:
        query = query.filter(Sale.customer_id == customer_id)
    if payment_status:
        query = query.filter(Sale.payment_status == payment_status.upper())

    sales = query.order_by(Sale.sale_id.desc()).all()
    return [s.to_dict() for s in sales]


@router.get("/{sale_id}", summary="Get single sale invoice")
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.sale_id == sale_id).first()
    if not sale:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sale invoice {sale_id} not found."
        )
    return sale.to_dict()


@router.post("", status_code=status.HTTP_201_CREATED, summary="Create new optical sale bill")
def create_sale(payload: SaleCreate, db: Session = Depends(get_db)):
    """
    Atomic transaction:
    1. Validates customer and products.
    2. Calculates subtotal, tax, discount, total.
    3. Creates Sale header.
    4. Creates SaleItems and updates Product stock quantities.
    5. Records InventoryMovements (OUT).
    6. If initial payment provided, records Payment and sets appropriate payment_status.
    """
    # 1. Customer check
    customer = db.query(Customer).filter(Customer.Customer_id == payload.customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Customer with ID {payload.customer_id} does not exist."
        )

    # 2. Product and line-item validation
    calculated_subtotal = 0.0
    items_to_create = []

    for item in payload.items:
        prod = db.query(Product).filter(Product.product_id == item.product_id).first()
        if not prod:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product with ID {item.product_id} does not exist."
            )

        line_subtotal = float(item.unit_price) * item.quantity
        calculated_subtotal += line_subtotal

        items_to_create.append({
            "product": prod,
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "subtotal": line_subtotal
        })

    discount = float(payload.discount or 0.0)
    tax = float(payload.tax or 0.0)
    grand_total = max(0.0, calculated_subtotal - discount + tax)

    # Determine payment status
    initial_pay = float(payload.initial_payment or 0.0)
    if initial_pay >= grand_total and grand_total > 0:
        pay_status = "PAID"
    elif initial_pay > 0:
        pay_status = "PARTIAL"
    else:
        pay_status = "PENDING"

    try:
        # Create Sale
        new_sale = Sale(
            customer_id=payload.customer_id,
            subtotal=calculated_subtotal,
            discount=discount,
            tax=tax,
            total_amount=grand_total,
            payment_status=pay_status
        )
        db.add(new_sale)
        db.flush()  # Populates new_sale.sale_id

        # Create Items & update stock
        for it in items_to_create:
            sale_item = SaleItem(
                sale_id=new_sale.sale_id,
                product_id=it["product"].product_id,
                quantity=it["quantity"],
                unit_price=it["unit_price"],
                subtotal=it["subtotal"]
            )
            db.add(sale_item)

            # Deduct stock safely
            curr_stock = it["product"].stock_quantity or 0
            it["product"].stock_quantity = max(0, curr_stock - it["quantity"])

            # Record inventory movement
            movement = InventoryMovement(
                product_id=it["product"].product_id,
                movement_type="OUT",
                quantity=it["quantity"],
                reason=f"Sale #{new_sale.sale_id}"
            )
            db.add(movement)

        # Record initial payment if any
        if initial_pay > 0:
            payment = Payment(
                sale_id=new_sale.sale_id,
                amount_paid=min(initial_pay, grand_total),
                payment_method=payload.payment_method.upper() if payload.payment_method else "CASH",
                payment_notes="Initial payment on invoice creation"
            )
            db.add(payment)

        db.commit()
        db.refresh(new_sale)
        return new_sale.to_dict()

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate sale bill: {str(e)}"
        )


@router.put("/{sale_id}", summary="Update existing bill or payment status")
def update_sale(sale_id: int, payload: SaleUpdate, db: Session = Depends(get_db)):
    """
    Updates bill totals, discount, payment status, or records additional payment.
    """
    sale = db.query(Sale).filter(Sale.sale_id == sale_id).first()
    if not sale:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sale bill #{sale_id} not found."
        )

    try:
        if payload.discount is not None:
            sale.discount = float(payload.discount)
        if payload.tax is not None:
            sale.tax = float(payload.tax)
        if payload.total_amount is not None:
            sale.total_amount = float(payload.total_amount)
        elif payload.discount is not None or payload.tax is not None:
            sale.total_amount = max(0.0, float(sale.subtotal or 0.0) - float(sale.discount or 0.0) + float(sale.tax or 0.0))

        # If adding a payment
        if payload.add_payment_amount and float(payload.add_payment_amount) > 0:
            pay = Payment(
                sale_id=sale.sale_id,
                amount_paid=float(payload.add_payment_amount),
                payment_method=(payload.payment_method or "UPI").upper(),
                payment_notes=payload.notes or "Payment update recorded on bill"
            )
            db.add(pay)
            db.flush()

        # Recalculate status from payments if applicable
        all_payments = db.query(Payment).filter(Payment.sale_id == sale.sale_id).all()
        total_paid = sum(float(p.amount_paid or 0) for p in all_payments)

        if payload.payment_status:
            sale.payment_status = payload.payment_status.upper()
        elif total_paid >= float(sale.total_amount or 0):
            sale.payment_status = "PAID"
        elif total_paid > 0:
            sale.payment_status = "PARTIAL"
        else:
            sale.payment_status = "PENDING"

        db.commit()
        db.refresh(sale)
        return sale.to_dict()

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update sale bill: {str(e)}"
        )
