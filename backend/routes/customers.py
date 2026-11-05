from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from sqlalchemy.exc import IntegrityError

from database import get_db
from models.customer import Customer
from models.prescription import Prescription
from models.sale import Sale
from models.repair import Repair
from schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse

router = APIRouter(prefix="/api/customers", tags=["Customers"])


@router.get("", response_model=List[CustomerResponse], summary="Retrieve customer directory")
def get_customers(
    search: Optional[str] = Query(None, description="Filter customers by name, phone, email, or city"),
    db: Session = Depends(get_db)
):
    """
    Fetches real customer records directly from the MySQL database with optional search filtering.
    """
    query = db.query(Customer)
    if search and search.strip():
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Customer.full_name.ilike(search_term),
                Customer.phone.ilike(search_term),
                Customer.email.ilike(search_term),
                Customer.address.ilike(search_term)
            )
        )
    return query.order_by(Customer.Customer_id.desc()).all()


@router.get("/{customer_id}", response_model=CustomerResponse, summary="Get single customer by ID")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.Customer_id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {customer_id} not found."
        )
    return customer


@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED, summary="Add new customer")
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)):
    """
    Inserts a new customer into the MySQL database with safe primary key assignment.
    """
    if not payload.full_name or not payload.full_name.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Customer full name cannot be blank."
        )

    # Safe primary key generation since Customer_id is not AUTO_INCREMENT in MySQL schema
    max_id = db.query(func.max(Customer.Customer_id)).scalar() or 0
    new_id = max_id + 1

    new_customer = Customer(
        Customer_id=new_id,
        full_name=payload.full_name.strip(),
        phone=payload.phone.strip() if payload.phone else None,
        email=payload.email.strip() if payload.email else None,
        address=payload.address.strip() if payload.address else None
    )
    try:
        db.add(new_customer)
        db.commit()
        db.refresh(new_customer)
        return new_customer
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not save customer due to database constraint: {str(e.orig)}"
        )


@router.put("/{customer_id}", response_model=CustomerResponse, summary="Update customer details (PUT)")
@router.patch("/{customer_id}", response_model=CustomerResponse, summary="Update customer details (PATCH)")
def update_customer(customer_id: int, payload: CustomerUpdate, db: Session = Depends(get_db)):
    """
    Updates an existing customer record in MySQL.
    """
    customer = db.query(Customer).filter(Customer.Customer_id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {customer_id} not found."
        )

    if payload.full_name is not None:
        val = payload.full_name.strip()
        if not val:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Customer full name cannot be blank."
            )
        customer.full_name = val

    if payload.phone is not None:
        customer.phone = payload.phone.strip() if payload.phone else None
    if payload.email is not None:
        customer.email = payload.email.strip() if payload.email else None
    if payload.address is not None:
        customer.address = payload.address.strip() if payload.address else None

    try:
        db.commit()
        db.refresh(customer)
        return customer
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update customer: {str(e.orig)}"
        )


@router.delete("/{customer_id}", status_code=status.HTTP_200_OK, summary="Delete customer")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    """
    Deletes a customer only when no foreign-key relationships restrict it.
    Gracefully handles integrity constraints.
    """
    customer = db.query(Customer).filter(Customer.Customer_id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {customer_id} not found."
        )

    # Check for foreign key references before deleting
    has_sales = db.query(Sale).filter(Sale.customer_id == customer_id).first()
    has_rx = db.query(Prescription).filter(Prescription.customer_id == customer_id).first()
    has_repairs = db.query(Repair).filter(Repair.customer_id == customer_id).first()

    if has_sales or has_rx or has_repairs:
        related_entities = []
        if has_sales: related_entities.append("sales invoices")
        if has_rx: related_entities.append("prescriptions")
        if has_repairs: related_entities.append("repair requests")
        reason = ", ".join(related_entities)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete customer #{customer_id} ({customer.full_name}) because active records ({reason}) exist in the database."
        )

    try:
        db.delete(customer)
        db.commit()
        return {"message": f"Customer #{customer_id} ({customer.full_name}) deleted successfully from MySQL."}
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete customer #{customer_id} due to existing foreign key constraints in the database."
        )
