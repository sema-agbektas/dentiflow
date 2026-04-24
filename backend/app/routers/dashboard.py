from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from datetime import date
from app.database import get_db
from app.models.models import Treatment, Appointment, Patient, Doctor
from app.routers.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    today = date.today()

    daily_revenue = db.query(func.sum(Treatment.cost)).filter(
        cast(Treatment.created_at, Date) == today
    ).scalar() or 0

    today_appointments = db.query(Appointment).filter(
        Appointment.date == str(today)
    ).count()

    total_patients = db.query(Patient).count()

    completed_treatments = db.query(Treatment).filter(
        cast(Treatment.created_at, Date) == today
    ).count()

    doctors = db.query(Doctor).all()
    doctor_revenue = []
    for doctor in doctors:
        revenue = db.query(func.sum(Treatment.cost)).filter(
            Treatment.doctor_id == doctor.id
        ).scalar() or 0
        doctor_revenue.append({
            "doctor_id": doctor.id,
            "doctor_name": f"Dr. {doctor.first_name} {doctor.last_name}",
            "specialization": doctor.specialization,
            "revenue": revenue
        })

    weekly_revenue = db.query(
        cast(Treatment.created_at, Date).label("date"),
        func.sum(Treatment.cost).label("total")
    ).group_by(
        cast(Treatment.created_at, Date)
    ).order_by(
        cast(Treatment.created_at, Date)
    ).limit(7).all()

    return {
        "daily_revenue": daily_revenue,
        "today_appointments": today_appointments,
        "total_patients": total_patients,
        "completed_treatments": completed_treatments,
        "doctor_revenue": doctor_revenue,
        "weekly_revenue": [
            {"date": str(r.date), "total": r.total}
            for r in weekly_revenue
        ]
    }