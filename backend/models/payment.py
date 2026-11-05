from sqlalchemy import Column, Integer, String, Numeric, Enum, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(Integer, primary_key=True, autoincrement=True)
    sale_id = Column(Integer, ForeignKey("sales.sale_id"), nullable=False)
    payment_date = Column(DateTime, default=func.now(), nullable=True)
    amount_paid = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(Enum("CASH", "UPI", "CARD", "BANK_TRANSFER", name="payment_method_enum"), nullable=False)
    transaction_reference = Column(String(100), nullable=True)
    payment_notes = Column(String(255), nullable=True)

    sale = relationship("Sale", back_populates="payments")

    def to_dict(self):
        return {
            "id": self.payment_id,
            "payment_id": self.payment_id,
            "sale_id": self.sale_id,
            "invoiceNo": f"INV-{self.sale_id:04d}",
            "customerName": self.sale.customer.full_name if (self.sale and self.sale.customer) else "Customer",
            "payment_date": self.payment_date.isoformat() if self.payment_date else None,
            "date": self.payment_date.isoformat() if self.payment_date else None,
            "amount_paid": float(self.amount_paid) if self.amount_paid is not None else 0.0,
            "amount": float(self.amount_paid) if self.amount_paid is not None else 0.0,
            "payment_method": self.payment_method,
            "method": self.payment_method,
            "transaction_reference": self.transaction_reference,
            "reference": self.transaction_reference,
            "payment_notes": self.payment_notes,
            "status": "Completed"
        }
