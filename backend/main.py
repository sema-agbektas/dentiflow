from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, patients, appointments, treatments, dashboard, doctors
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dentiflow API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://dentiflow-app.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(appointments.router)
app.include_router(treatments.router)
app.include_router(dashboard.router)
app.include_router(doctors.router)

@app.get("/")
def root():
    return {"message": "Dentiflow API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}