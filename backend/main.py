import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import test_connection
from routes import (
    customers_router,
    categories_router,
    products_router,
    prescriptions_router,
    sales_router,
    payments_router,
    suppliers_router,
    purchase_orders_router,
    repairs_router,
    dashboard_router,
    auth_router
)

# Load environment variables
load_dotenv()

app = FastAPI(
    title="DAWARE OPTICIANS Management API",
    description="Backend REST API for DAWARE OPTICIANS Store Management Dashboard",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration for frontend
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    os.getenv("FRONTEND_ORIGIN", "http://localhost:3000"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(dashboard_router)
app.include_router(customers_router)
app.include_router(categories_router)
app.include_router(products_router)
app.include_router(prescriptions_router)
app.include_router(sales_router)
app.include_router(payments_router)
app.include_router(suppliers_router)
app.include_router(purchase_orders_router)
app.include_router(repairs_router)
app.include_router(auth_router)


@app.get("/", tags=["General"])
def root():
    return {
        "system": "DAWARE OPTICIANS Internal Management API",
        "status": "online",
        "database": "daware_opticians",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/api/health", tags=["General"])
def health_check():
    """
    Check API status and MySQL database connectivity.
    """
    db_connected, db_message = test_connection()
    return {
        "api_status": "ok",
        "database_connected": db_connected,
        "database_message": db_message
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
