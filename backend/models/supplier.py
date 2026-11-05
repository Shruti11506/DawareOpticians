from sqlalchemy import Column, Integer, String, DateTime, func
from database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    supplier_id = Column(Integer, primary_key=True, autoincrement=True)
    supplier_name = Column(String(100), nullable=False)
    contact_person = Column(String(100), nullable=True)
    phone = Column(String(15), nullable=True)
    email = Column(String(100), nullable=True)
    address = Column(String(255), nullable=True)
    city = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=True)

    def to_dict(self):
        return {
            "id": self.supplier_id,
            "supplier_id": self.supplier_id,
            "name": self.supplier_name,
            "supplier_name": self.supplier_name,
            "contactPerson": self.contact_person,
            "contact_person": self.contact_person,
            "phone": self.phone,
            "email": self.email,
            "address": self.address,
            "city": self.city,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
