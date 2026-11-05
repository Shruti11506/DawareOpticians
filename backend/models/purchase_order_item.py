from sqlalchemy import Column, Integer, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"

    purchase_item_id = Column(Integer, primary_key=True, autoincrement=True)
    purchase_order_id = Column(Integer, ForeignKey("purchase_orders.purchase_order_id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.product_id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_cost = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)

    purchase_order = relationship("PurchaseOrder", back_populates="items")
    product = relationship("Product", lazy="joined")

    def to_dict(self):
        return {
            "purchase_item_id": self.purchase_item_id,
            "purchase_order_id": self.purchase_order_id,
            "product_id": self.product_id,
            "product_name": self.product.product_name if self.product else "Product",
            "quantity": self.quantity,
            "unit_cost": float(self.unit_cost) if self.unit_cost is not None else 0.0,
            "subtotal": float(self.subtotal) if self.subtotal is not None else 0.0
        }
