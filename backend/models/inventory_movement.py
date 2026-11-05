from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class InventoryMovement(Base):
    __tablename__ = "inventory_movements"

    movement_id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.product_id"), nullable=False)
    movement_type = Column(Enum("IN", "OUT", name="movement_type_enum"), nullable=False)
    quantity = Column(Integer, nullable=False)
    reason = Column(String(255), nullable=True)
    movement_date = Column(DateTime, default=func.now(), nullable=True)

    product = relationship("Product", lazy="joined")

    def to_dict(self):
        return {
            "movement_id": self.movement_id,
            "product_id": self.product_id,
            "product_name": self.product.product_name if self.product else None,
            "movement_type": self.movement_type,
            "quantity": self.quantity,
            "reason": self.reason,
            "movement_date": self.movement_date.isoformat() if self.movement_date else None
        }
