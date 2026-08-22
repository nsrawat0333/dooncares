from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from app.database import engine, Base, get_db
from app.schemas import BookingCreate, BookingOut, ReviewCreate, ReviewOut
from app import crud

# Create database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DoonCares Backend API",
    description="Python FastAPI & PostgreSQL backend for DoonCares Home Services",
    version="1.0.0"
)

# Enable CORS for Netlify frontend and local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to DoonCares API", "docs": "/docs", "bookings": "/api/bookings", "reviews": "/api/reviews"}

@app.get("/api/health")
def health_check():
    return {"status": "online", "service": "DoonCares Backend API"}

# --- Booking Routes ---
@app.post("/api/bookings", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
@app.post("/bookings", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_new_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    if not booking.name or not booking.phone or not booking.date:
        raise HTTPException(status_code=400, detail="Name, Phone, and Date are required.")
    return crud.create_booking(db=db, booking_data=booking)

@app.get("/api/bookings", response_model=List[BookingOut])
@app.get("/bookings", response_model=List[BookingOut])
def list_bookings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_bookings(db=db, skip=skip, limit=limit)

@app.delete("/api/bookings/{booking_id}")
@app.delete("/bookings/{booking_id}")
def delete_existing_booking(booking_id: int, db: Session = Depends(get_db)):
    success = crud.delete_booking(db=db, booking_id=booking_id)
    if not success:
        raise HTTPException(status_code=404, detail="Booking not found.")
    return {"status": "success", "message": f"Booking ID {booking_id} deleted successfully."}

@app.put("/api/bookings/{booking_id}/complete")
@app.put("/bookings/{booking_id}/complete")
def mark_booking_completed(booking_id: int, db: Session = Depends(get_db)):
    updated = crud.update_booking_status(db=db, booking_id=booking_id, status_str="Completed")
    if not updated:
        raise HTTPException(status_code=404, detail="Booking not found.")
    return {"status": "success", "message": f"Booking ID {booking_id} status updated to Completed.", "booking": updated}

# --- Review Routes ---
@app.post("/api/reviews", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
@app.post("/reviews", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_new_review(review: ReviewCreate, db: Session = Depends(get_db)):
    if not review.name or not review.comment:
        raise HTTPException(status_code=400, detail="Name and Comment are required.")
    if review.rating < 1 or review.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5.")
    return crud.create_review(db=db, review_data=review)

@app.get("/api/reviews", response_model=List[ReviewOut])
@app.get("/reviews", response_model=List[ReviewOut])
def list_reviews(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_reviews(db=db, skip=skip, limit=limit)
