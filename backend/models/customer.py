from sqlalchemy import Column, Integer, String, DateTime, func
from database import Base

class Customer(Base):
    """
    SQLAlchemy model reflecting the existing 'customers' table in MySQL.
    Strictly read/write mapping without DDL / schema alteration.
    """
    __tablename__ = "customers"

    Customer_id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(15), nullable=True)
    email = Column(String(100), nullable=True)
    address = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=True)

    def to_dict(self):
        return {
            "id": self.Customer_id,
            "Customer_id": self.Customer_id,
            "full_name": self.full_name,
            "phone": self.phone,
            "email": self.email,
            "address": self.address,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

