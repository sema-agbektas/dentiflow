import { useEffect, useState } from "react";
import { getDashboardSummary } from "../api/index";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then((res) => setSummary(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500 text-sm">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <p className="text-xs text-slate-500 font-medium mb-1">Daily Revenue</p>
          <p className="text-2xl font-extrabold text-slate-900">
            ₺{summary?.daily_revenue?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <p className="text-xs text-slate-500 font-medium mb-1">Today's Appointments</p>
          <p className="text-2xl font-extrabold text-slate-900">
            {summary?.today_appointments || 0}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <p className="text-xs text-slate-500 font-medium mb-1">Total Patients</p>
          <p className="text-2xl font-extrabold text-slate-900">
            {summary?.total_patients || 0}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <p className="text-xs text-slate-500 font-medium mb-1">Treatments Today</p>
          <p className="text-2xl font-extrabold text-slate-900">
            {summary?.completed_treatments || 0}
          </p>
        </div>
      </div>

      {/* Chart + Doctors */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Weekly Revenue Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Weekly Revenue</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={summary?.weekly_revenue || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Doctor Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Doctor Revenue</h2>
          <div className="space-y-3">
            {summary?.doctor_revenue?.length === 0 && (
              <p className="text-slate-400 text-sm">No data yet.</p>
            )}
            {summary?.doctor_revenue?.map((d) => (
              <div key={d.doctor_id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{d.doctor_name}</p>
                  <p className="text-xs text-slate-400">{d.specialization}</p>
                </div>
                <p className="text-sm font-bold text-teal-600">₺{d.revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}