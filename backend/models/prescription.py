from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class Prescription(Base):
    __tablename__ = "prescriptions"

    prescription_id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.Customer_id"), nullable=False)
    right_sph = Column(Numeric(5, 2), nullable=True)
    right_cyl = Column(Numeric(5, 2), nullable=True)
    right_axis = Column(Integer, nullable=True)
    left_sph = Column(Numeric(5, 2), nullable=True)
    left_cyl = Column(Numeric(5, 2), nullable=True)
    left_axis = Column(Integer, nullable=True)
    add_power = Column(Numeric(5, 2), nullable=True)
    pupillary_distance = Column(Numeric(5, 2), nullable=True)
    optometrist_name = Column(String(100), nullable=True)
    prescription_date = Column(Date, nullable=True)
    notes = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=True)

    customer = relationship("Customer", lazy="joined")

    def to_dict(self):
        return {
            "id": self.prescription_id,
            "prescription_id": self.prescription_id,
            "customer_id": self.customer_id,
            "customer_name": self.customer.full_name if self.customer else "Unknown",
            "right_sph": float(self.right_sph) if self.right_sph is not None else None,
            "right_cyl": float(self.right_cyl) if self.right_cyl is not None else None,
            "right_axis": self.right_axis,
            "left_sph": float(self.left_sph) if self.left_sph is not None else None,
            "left_cyl": float(self.left_cyl) if self.left_cyl is not None else None,
            "left_axis": self.left_axis,
            "add_power": float(self.add_power) if self.add_power is not None else None,
            "pupillary_distance": float(self.pupillary_distance) if self.pupillary_distance is not None else None,
            "optometrist_name": self.optometrist_name,
            "prescription_date": self.prescription_date.isoformat() if self.prescription_date else None,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
