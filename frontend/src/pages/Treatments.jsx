import { useEffect, useState } from "react";
import { getTreatments, createTreatment, deleteTreatment, getPatients } from "../api/index";

export default function Treatments() {
  const [treatments, setTreatments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patient_id: "", doctor_id: "", treatment_name: "", cost: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const doctors = [
    { id: 1, name: "Dr. Mehmet Eren" },
    { id: 2, name: "Dr. Zeynep Arslan" },
    { id: 3, name: "Dr. Can Yılmaz" },
  ];

  async function fetchTreatments() {
    const res = await getTreatments();
    setTreatments(res.data);
  }

  async function fetchPatients() {
    const res = await getPatients();
    setPatients(res.data);
  }

  useEffect(() => {
    fetchTreatments();
    fetchPatients();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await createTreatment({
        ...form,
        patient_id: Number(form.patient_id),
        doctor_id: Number(form.doctor_id),
        cost: Number(form.cost),
      });
      setForm({ patient_id: "", doctor_id: "", treatment_name: "", cost: "", notes: "" });
      setShowForm(false);
      fetchTreatments();
    } catch {
      alert("Error creating treatment");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this treatment?")) return;
    await deleteTreatment(id);
    fetchTreatments();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Treatments</h1>
          <p className="text-slate-500 text-sm mt-1">{treatments.length} treatments total</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
        >
          + Add Treatment
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 mb-4">New Treatment</h2>
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
              placeholder="Treatment Name (e.g. Root Canal)"
              value={form.treatment_name}
              onChange={(e) => setForm({ ...form, treatment_name: e.target.value })}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
              required
            />
            <input
              placeholder="Cost (₺)"
              type="number"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
              required
            />
            <input
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="col-span-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="col-span-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2.5 rounded-xl transition text-sm"
            >
              {loading ? "Saving..." : "Save Treatment"}
            </button>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {treatments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No treatments yet.</div>
        ) : (
          treatments.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-5 py-4 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-lg">
                  💊
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.treatment_name}</p>
                  <p className="text-xs text-slate-400">{t.patient_name} · {t.doctor_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-bold text-teal-600">₺{t.cost.toFixed(2)}</p>
                <button
                  onClick={() => handleDelete(t.id)}
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