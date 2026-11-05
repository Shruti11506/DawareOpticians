from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from models.purchase_order import PurchaseOrder
from models.purchase_order_item import PurchaseOrderItem
from models.supplier import Supplier
from models.product import Product
from models.inventory_movement import InventoryMovement
from schemas.purchase_order import PurchaseOrderCreate

router = APIRouter(prefix="/api/purchase-orders", tags=["Purchase Orders & Procurement"])


@router.get("", response_model=List[dict], summary="List purchase orders")
def get_purchase_orders(
    supplier_id: Optional[int] = Query(None, description="Filter by supplier ID"),
    order_status: Optional[str] = Query(None, description="PENDING, RECEIVED, or CANCELLED"),
    db: Session = Depends(get_db)
):
    query = db.query(PurchaseOrder)
    if supplier_id:
        query = query.filter(PurchaseOrder.supplier_id == supplier_id)
    if order_status:
        query = query.filter(PurchaseOrder.order_status == order_status.upper())

    pos = query.order_by(PurchaseOrder.purchase_order_id.desc()).all()
    return [po.to_dict() for po in pos]


@router.get("/{po_id}", summary="Get purchase order details")
def get_purchase_order(po_id: int, db: Session = Depends(get_db)):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.purchase_order_id == po_id).first()
    if not po:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Purchase order {po_id} not found."
        )
    return po.to_dict()


@router.post("", status_code=status.HTTP_201_CREATED, summary="Create new purchase order")
def create_purchase_order(payload: PurchaseOrderCreate, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.supplier_id == payload.supplier_id).first()
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Supplier {payload.supplier_id} does not exist."
        )

    total_amount = sum(float(item.unit_cost) * item.quantity for item in payload.items)

    try:
        new_po = PurchaseOrder(
            supplier_id=payload.supplier_id,
            order_date=payload.order_date,
            expected_delivery_date=payload.expected_delivery_date,
            total_amount=total_amount,
            order_status=payload.order_status.upper() if payload.order_status else "PENDING",
            notes=payload.notes.strip() if payload.notes else None
        )
        db.add(new_po)
        db.flush()

        for it in payload.items:
            po_item = PurchaseOrderItem(
                purchase_order_id=new_po.purchase_order_id,
                product_id=it.product_id,
                quantity=it.quantity,
                unit_cost=it.unit_cost,
                subtotal=float(it.unit_cost) * it.quantity
            )
            db.add(po_item)

        db.commit()
        db.refresh(new_po)
        return new_po.to_dict()

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create purchase order: {str(e)}"
        )


@router.put("/{po_id}/status", summary="Update purchase order status (e.g. RECEIVED)")
def update_po_status(po_id: int, new_status: str = Query(..., description="RECEIVED, PENDING, or CANCELLED"), db: Session = Depends(get_db)):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.purchase_order_id == po_id).first()
    if not po:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Purchase order {po_id} not found."
        )

    status_clean = new_status.upper().strip()
    if status_clean not in ["PENDING", "RECEIVED", "CANCELLED"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status. Must be PENDING, RECEIVED, or CANCELLED."
        )

    # If transitioning to RECEIVED, increment stock
    if po.order_status != "RECEIVED" and status_clean == "RECEIVED":
        for item in po.items:
            prod = db.query(Product).filter(Product.product_id == item.product_id).first()
            if prod:
                prod.stock_quantity = (prod.stock_quantity or 0) + item.quantity
                movement = InventoryMovement(
                    product_id=prod.product_id,
                    movement_type="IN",
                    quantity=item.quantity,
                    reason=f"Received PO #{po.purchase_order_id}"
                )
                db.add(movement)

    po.order_status = status_clean
    db.commit()
    db.refresh(po)
    return po.to_dict()
