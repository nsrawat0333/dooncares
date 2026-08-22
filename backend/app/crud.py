import uuid
from sqlalchemy.orm import Session
from app.models import Booking, Review
from app.schemas import BookingCreate, ReviewCreate

def create_booking(db: Session, booking_data: BookingCreate):
    booking_id = f"BKG_{uuid.uuid4().hex[:8].upper()}"
    db_booking = Booking(
        booking_id=booking_id,
        name=booking_data.name,
        phone=booking_data.phone,
        date=booking_data.date,
        service_details=booking_data.service_details,
        status="Pending"
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_bookings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Booking).order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()

def delete_booking(db: Session, booking_id: int):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking:
        db.delete(booking)
        db.commit()
        return True
    return False

def update_booking_status(db: Session, booking_id: int, status_str: str):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking:
        booking.status = status_str
        db.commit()
        db.refresh(booking)
        return booking
    return None

def create_review(db: Session, review_data: ReviewCreate):
    db_review = Review(
        name=review_data.name,
        rating=review_data.rating,
        comment=review_data.comment
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_reviews(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Review).order_by(Review.created_at.desc()).offset(skip).limit(limit).all()
