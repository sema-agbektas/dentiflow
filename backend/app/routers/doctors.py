from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import Doctor
from app.routers.auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/doctors", tags=["doctors"])

class DoctorCreate(BaseModel):
    first_name: str
    last_name: str
    specialization: Optional[str] = None

class DoctorResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    specialization: Optional[str] = None

class Config:
    orm_mode = True

@router.get("/", response_model=List[DoctorResponse])
def get_doctors(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(Doctor).all()

@router.post("/", response_model=DoctorResponse)
def create_doctor(
    doctor: DoctorCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_doctor = Doctor(**doctor.dict())
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    return new_doctor

@router.delete("/{doctor_id}")
def delete_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    db.delete(doctor)
    db.commit()
    return {"message": "Doctor deleted successfully"}