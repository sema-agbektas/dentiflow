from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.database import get_db
from app.models.models import Appointment, Patient, Doctor
from app.routers.auth import get_current_user

router = APIRouter(prefix="/appointments", tags=["appointments"])

class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    date: str
    time: str
    status: Optional[str] = "pending"

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    date: str
    time: str
    status: str
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None

    class Config:
        from_attributes = True

@router.get("/", response_model=List[AppointmentResponse])
def get_appointments(
    date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = db.query(Appointment)
    if date:
        query = query.filter(Appointment.date == date)
    appointments = query.order_by(Appointment.date, Appointment.time).all()

    result = []
    for a in appointments:
        patient = db.query(Patient).filter(Patient.id == a.patient_id).first()
        doctor = db.query(Doctor).filter(Doctor.id == a.doctor_id).first()
        result.append(AppointmentResponse(
            id=a.id,
            patient_id=a.patient_id,
            doctor_id=a.doctor_id,
            date=a.date,
            time=a.time,
            status=a.status,
            patient_name=f"{patient.first_name} {patient.last_name}" if patient else None,
            doctor_name=f"Dr. {doctor.first_name} {doctor.last_name}" if doctor else None,
        ))
    return result

@router.post("/", response_model=AppointmentResponse)
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_appt = Appointment(**appointment.dict())
    db.add(new_appt)
    db.commit()
    db.refresh(new_appt)
    return AppointmentResponse(
        id=new_appt.id,
        patient_id=new_appt.patient_id,
        doctor_id=new_appt.doctor_id,
        date=new_appt.date,
        time=new_appt.time,
        status=new_appt.status,
    )

@router.patch("/{appointment_id}/status")
def update_status(
    appointment_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    valid_statuses = ["pending", "completed", "cancelled", "missed"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = status
    db.commit()
    return {"message": "Status updated"}

@router.delete("/{appointment_id}")
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db.delete(appt)
    db.commit()
    return {"message": "Appointment deleted"}