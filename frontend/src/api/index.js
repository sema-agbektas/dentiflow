import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (email, password) => {
  const formData = new FormData();
  formData.append("username", email);
  formData.append("password", password);
  return api.post("/auth/login", formData);
};

export const register = (email, password) =>
  api.post("/auth/register", { email, password });

// Patients
export const getPatients = (search) =>
  api.get("/patients/", { params: { search } });

export const createPatient = (data) => api.post("/patients/", data);
export const deletePatient = (id) => api.delete(`/patients/${id}`);

// Appointments
export const getAppointments = (date) =>
  api.get("/appointments/", { params: { date } });

export const createAppointment = (data) => api.post("/appointments/", data);
export const updateAppointmentStatus = (id, status) =>
  api.patch(`/appointments/${id}/status`, null, { params: { status } });
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

// Treatments
export const getTreatments = () => api.get("/treatments/");
export const createTreatment = (data) => api.post("/treatments/", data);
export const deleteTreatment = (id) => api.delete(`/treatments/${id}`);

// Dashboard
export const getDashboardSummary = () => api.get("/dashboard/summary");