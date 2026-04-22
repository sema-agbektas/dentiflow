import { useEffect, useState } from "react";
import { getPatients, createPatient, deletePatient } from "../api/index";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", notes: "" });
  const [loading, setLoading] = useState(false);

  async function fetchPatients() {
    const res = await getPatients(search);
    setPatients(res.data);
  }

  useEffect(() => {
    fetchPatients();
  }, [search]);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await createPatient(form);
      setForm({ first_name: "", last_name: "", phone: "", notes: "" });
      setShowForm(false);
      fetchPatients();
    } catch {
      alert("Error creating patient");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this patient?")) return;
    await deletePatient(id);
    fetchPatients();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Patients</h1>
          <p className="text-slate-500 text-sm mt-1">{patients.length} patients total</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
        >
          + Add Patient
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 mb-4">New Patient</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <input
              placeholder="First Name"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
              required
            />
            <input
              placeholder="Last Name"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
              required
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
            />
            <input
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="col-span-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2.5 rounded-xl transition text-sm"
            >
              {loading ? "Saving..." : "Save Patient"}
            </button>
          </form>
        </div>
      )}

      {/* Search */}
      <input
        placeholder="🔍 Search patients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 bg-white"
      />

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {patients.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No patients yet.</div>
        ) : (
          patients.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-5 py-4 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-sm">
                  {p.first_name[0]}{p.last_name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{p.first_name} {p.last_name}</p>
                  <p className="text-xs text-slate-400">{p.phone || "No phone"} · {p.notes || "No notes"}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-xs text-red-400 hover:text-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}