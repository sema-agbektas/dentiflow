import { useEffect, useState } from "react";
import { getAppointments, createAppointment, deleteAppointment, updateAppointmentStatus, getPatients } from "../api/index";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patient_id: "", doctor_id: "", date: "", time: "", status: "pending" });
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState("");

  const doctors = [
    { id: 1, name: "Dr. Mehmet Eren" },
    { id: 2, name: "Dr. Zeynep Arslan" },
    { id: 3, name: "Dr. Can Yılmaz" },
  ];

  async function fetchAppointments() {
    const res = await getAppointments(filterDate);
    setAppointments(res.data);
  }

  async function fetchPatients() {
    const res = await getPatients();
    setPatients(res.data);
  }

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, [filterDate]);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await createAppointment({
        ...form,
        patient_id: Number(form.patient_id),
        doctor_id: Number(form.doctor_id),
      });
      setForm({ patient_id: "", doctor_id: "", date: "", time: "", status: "pending" });
      setShowForm(false);
      fetchAppointments();
    } catch {
      alert("Error creating appointment");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this appointment?")) return;
    await deleteAppointment(id);
    fetchAppointments();
  }

  async function handleStatus(id, status) {
    await updateAppointmentStatus(id, status);
    fetchAppointments();
  }

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Appointments</h1>
          <p className="text-slate-500 text-sm mt-1">{appointments.length} appointments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
        >
          + Add Appointment
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 mb-4">New Appointment</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <select
              value={form.patient_id}
              onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
              required
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
              ))}
            </select>
            <select
              value={form.doctor_id}
              onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
              required
            />
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="col-span-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2.5 rounded-xl transition text-sm"
            >
              {loading ? "Saving..." : "Save Appointment"}
            </button>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-3">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 bg-white"
        />
        {filterDate && (
          <button
            onClick={() => setFilterDate("")}
            className="text-sm text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No appointments yet.</div>
        ) : (
          appointments.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-5 py-4 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="bg-teal-50 text-teal-600 font-mono text-xs font-semibold px-3 py-1.5 rounded-lg">
                  {a.time}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{a.patient_name}</p>
                  <p className="text-xs text-slate-400">{a.doctor_name} · {a.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={a.status}
                  onChange={(e) => handleStatus(a.id, e.target.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 focus:outline-none ${statusColor[a.status]}`}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}