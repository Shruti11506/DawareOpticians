from datetime import date, datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.customer import Customer
from models.product import Product
from models.sale import Sale
from models.payment import Payment
from models.repair import Repair
from models.supplier import Supplier
from models.purchase_order import PurchaseOrder

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard Overview"])


@router.get("/metrics", summary="Get live business KPIs directly from MySQL")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    today = date.today()
    first_of_month = date(today.year, today.month, 1)

    total_customers = db.query(func.count(Customer.Customer_id)).scalar() or 0
    total_products = db.query(func.count(Product.product_id)).scalar() or 0
    total_suppliers = db.query(func.count(Supplier.supplier_id)).scalar() or 0

    # Low stock items (<= 5)
    low_stock_count = db.query(func.count(Product.product_id)).filter(Product.stock_quantity <= 5).scalar() or 0

    # Ongoing repairs
    ongoing_repairs = db.query(func.count(Repair.repair_id)).filter(
        Repair.repair_status.in_(["RECEIVED", "IN_PROGRESS"])
    ).scalar() or 0

    # Pending purchase orders
    pending_pos = db.query(func.count(PurchaseOrder.purchase_order_id)).filter(
        PurchaseOrder.order_status == "PENDING"
    ).scalar() or 0

    # Sales metrics
    all_sales = db.query(Sale).all()
    today_sales_val = 0.0
    today_sales_count = 0
    monthly_revenue = 0.0
    pending_payments_amount = 0.0
    pending_payments_count = 0

    for s in all_sales:
        s_date = s.sale_date.date() if s.sale_date else None
        total = float(s.total_amount or 0.0)

        # Calculate paid amount on this sale
        paid = sum(float(p.amount_paid or 0.0) for p in s.payments) if s.payments else 0.0
        due = max(0.0, total - paid)

        if s_date == today:
            today_sales_val += total
            today_sales_count += 1

        if s_date and s_date >= first_of_month:
            monthly_revenue += total

        if due > 0:
            pending_payments_amount += due
            pending_payments_count += 1

    return {
        "totalCustomers": total_customers,
        "totalProducts": total_products,
        "totalSuppliers": total_suppliers,
        "todaySales": today_sales_val,
        "todaySalesCount": today_sales_count,
        "monthlyRevenue": monthly_revenue,
        "pendingPaymentsAmount": pending_payments_amount,
        "pendingPaymentsCount": pending_payments_count,
        "lowStockCount": low_stock_count,
        "ongoingRepairsCount": ongoing_repairs,
        "pendingPurchaseOrdersCount": pending_pos
    }
