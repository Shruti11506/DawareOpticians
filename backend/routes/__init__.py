from routes.customers import router as customers_router
from routes.categories import router as categories_router
from routes.products import router as products_router
from routes.prescriptions import router as prescriptions_router
from routes.sales import router as sales_router
from routes.payments import router as payments_router
from routes.suppliers import router as suppliers_router
from routes.purchase_orders import router as purchase_orders_router
from routes.repairs import router as repairs_router
from routes.dashboard import router as dashboard_router
from routes.auth import router as auth_router

__all__ = [
    "customers_router",
    "categories_router",
    "products_router",
    "prescriptions_router",
    "sales_router",
    "payments_router",
    "suppliers_router",
    "purchase_orders_router",
    "repairs_router",
    "dashboard_router",
    "auth_router"
]
