from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, autoincrement=True)
    product_name = Column(String(100), nullable=False)
    brand = Column(String(100), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.category_id"), nullable=True)
    model_number = Column(String(50), nullable=True)
    selling_price = Column(Numeric(10, 2), nullable=False)
    stock_quantity = Column(Integer, default=0, nullable=True)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=True)

    category = relationship("Category", lazy="joined")

    def to_dict(self):
        return {
            "id": self.product_id,
            "product_id": self.product_id,
            "product_name": self.product_name,
            "brand": self.brand,
            "category_id": self.category_id,
            "category_name": self.category.category_name if self.category else "Uncategorized",
            "model_number": self.model_number,
            "selling_price": float(self.selling_price) if self.selling_price is not None else 0.0,
            "stock_quantity": self.stock_quantity or 0,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
