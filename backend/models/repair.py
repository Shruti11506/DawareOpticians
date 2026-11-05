from sqlalchemy import Column, Integer, String, Numeric, Enum, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Repair(Base):
    __tablename__ = "repairs"

    repair_id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.Customer_id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.product_id"), nullable=True)
    repair_description = Column(String(255), nullable=False)
    repair_cost = Column(Numeric(10, 2), default=0.00, nullable=True)
    received_date = Column(Date, nullable=False)
    expected_delivery_date = Column(Date, nullable=True)
    actual_delivery_date = Column(Date, nullable=True)
    repair_status = Column(
        Enum("RECEIVED", "IN_PROGRESS", "COMPLETED", "DELIVERED", "CANCELLED", name="repair_status_enum"),
        default="RECEIVED",
        nullable=True
    )
    notes = Column(String(255), nullable=True)

    customer = relationship("Customer", lazy="joined")
    product = relationship("Product", lazy="joined")

    def to_dict(self):
        # Format friendly status
        status_map = {
            "RECEIVED": "Received",
            "IN_PROGRESS": "In Progress",
            "COMPLETED": "Ready for Pickup",
            "DELIVERED": "Delivered",
            "CANCELLED": "Cancelled"
        }
        return {
            "id": self.repair_id,
            "repair_id": self.repair_id,
            "repairTicket": f"REP-{self.repair_id:04d}",
            "customer_id": self.customer_id,
            "customerName": self.customer.full_name if self.customer else "Customer",
            "customerPhone": self.customer.phone if self.customer else "",
            "product_id": self.product_id,
            "itemDetails": self.product.product_name if self.product else "Customer Frame/Glasses",
            "repair_description": self.repair_description,
            "issue": self.repair_description,
            "repair_cost": float(self.repair_cost) if self.repair_cost is not None else 0.0,
            "cost": float(self.repair_cost) if self.repair_cost is not None else 0.0,
            "received_date": self.received_date.isoformat() if self.received_date else None,
            "receivedDate": self.received_date.isoformat() if self.received_date else None,
            "expected_delivery_date": self.expected_delivery_date.isoformat() if self.expected_delivery_date else None,
            "expectedDelivery": self.expected_delivery_date.isoformat() if self.expected_delivery_date else None,
            "actual_delivery_date": self.actual_delivery_date.isoformat() if self.actual_delivery_date else None,
            "repair_status": self.repair_status,
            "status": status_map.get(self.repair_status, self.repair_status),
            "notes": self.notes
        }
