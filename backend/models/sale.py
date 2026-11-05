from sqlalchemy import Column, Integer, Numeric, Enum, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class Sale(Base):
    __tablename__ = "sales"

    sale_id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.Customer_id"), nullable=False)
    sale_date = Column(DateTime, default=func.now(), nullable=True)
    subtotal = Column(Numeric(10, 2), nullable=False)
    discount = Column(Numeric(10, 2), default=0.00, nullable=True)
    tax = Column(Numeric(10, 2), default=0.00, nullable=True)
    total_amount = Column(Numeric(10, 2), nullable=False)
    payment_status = Column(Enum("PAID", "PARTIAL", "PENDING", name="sale_payment_status_enum"), default="PENDING", nullable=True)

    customer = relationship("Customer", lazy="joined")
    items = relationship("SaleItem", back_populates="sale", lazy="joined")
    payments = relationship("Payment", back_populates="sale", lazy="joined")

    def to_dict(self):
        paid_amount = sum(float(p.amount_paid) for p in self.payments) if self.payments else 0.0
        total = float(self.total_amount) if self.total_amount is not None else 0.0
        balance = max(0.0, total - paid_amount)

        return {
            "id": self.sale_id,
            "sale_id": self.sale_id,
            "invoiceNo": f"INV-{self.sale_id:04d}",
            "customer_id": self.customer_id,
            "customerName": self.customer.full_name if self.customer else "Walk-in Customer",
            "customerPhone": self.customer.phone if self.customer else "",
            "date": self.sale_date.isoformat() if self.sale_date else None,
            "subtotal": float(self.subtotal) if self.subtotal is not None else 0.0,
            "discount": float(self.discount) if self.discount is not None else 0.0,
            "tax": float(self.tax) if self.tax is not None else 0.0,
            "grandTotal": total,
            "total_amount": total,
            "amountPaid": paid_amount,
            "balanceDue": balance,
            "paymentStatus": self.payment_status.capitalize() if self.payment_status else "Pending",
            "items": [item.to_dict() for item in self.items] if self.items else []
        }
