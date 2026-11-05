from sqlalchemy import Column, Integer, String, Numeric, Enum, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    purchase_order_id = Column(Integer, primary_key=True, autoincrement=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.supplier_id"), nullable=False)
    order_date = Column(Date, nullable=False)
    expected_delivery_date = Column(Date, nullable=True)
    total_amount = Column(Numeric(10, 2), nullable=False)
    order_status = Column(Enum("PENDING", "RECEIVED", "CANCELLED", name="po_status_enum"), default="PENDING", nullable=True)
    notes = Column(String(255), nullable=True)

    supplier = relationship("Supplier", lazy="joined")
    items = relationship("PurchaseOrderItem", back_populates="purchase_order", lazy="joined")

    def to_dict(self):
        return {
            "id": self.purchase_order_id,
            "purchase_order_id": self.purchase_order_id,
            "poNumber": f"PO-{self.purchase_order_id:04d}",
            "supplier_id": self.supplier_id,
            "supplierName": self.supplier.supplier_name if self.supplier else "Supplier",
            "order_date": self.order_date.isoformat() if self.order_date else None,
            "expected_delivery_date": self.expected_delivery_date.isoformat() if self.expected_delivery_date else None,
            "total_amount": float(self.total_amount) if self.total_amount is not None else 0.0,
            "order_status": self.order_status,
            "notes": self.notes,
            "items": [item.to_dict() for item in self.items] if self.items else []
        }
