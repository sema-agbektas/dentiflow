from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.database import get_db
from app.models.models import Treatment, Patient, Doctor
from app.routers.auth import get_current_user

router = APIRouter(prefix="/treatments", tags=["treatments"])

class TreatmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    treatment_name: str
    cost: float
    notes: Optional[str] = None

class TreatmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    treatment_name: str
    cost: float
    notes: Optional[str]
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None

    class Config:
        from_attributes = True

@router.get("/", response_model=List[TreatmentResponse])
def get_treatments(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    treatments = db.query(Treatment).order_by(Treatment.created_at.desc()).all()
    result = []
    for t in treatments:
        patient = db.query(Patient).filter(Patient.id == t.patient_id).first()
        doctor = db.query(Doctor).filter(Doctor.id == t.doctor_id).first()
        result.append(TreatmentResponse(
            id=t.id,
            patient_id=t.patient_id,
            doctor_id=t.doctor_id,
            treatment_name=t.treatment_name,
            cost=t.cost,
            notes=t.notes,
            patient_name=f"{patient.first_name} {patient.last_name}" if patient else None,
            doctor_name=f"Dr. {doctor.first_name} {doctor.last_name}" if doctor else None,
        ))
    return result

@router.post("/", response_model=TreatmentResponse)
def create_treatment(
    treatment: TreatmentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_treatment = Treatment(**treatment.dict())
    db.add(new_treatment)
    db.commit()
    db.refresh(new_treatment)
    return TreatmentResponse(
        id=new_treatment.id,
        patient_id=new_treatment.patient_id,
        doctor_id=new_treatment.doctor_id,
        treatment_name=new_treatment.treatment_name,
        cost=new_treatment.cost,
        notes=new_treatment.notes,
    )

@router.delete("/{treatment_id}")
def delete_treatment(
    treatment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    treatment = db.query(Treatment).filter(Treatment.id == treatment_id).first()
    if not treatment:
        raise HTTPException(status_code=404, detail="Treatment not found")
    db.delete(treatment)
    db.commit()
    return {"message": "Treatment deleted"}