import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { to: "/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/patients", icon: "👤", label: "Patients" },
  { to: "/appointments", icon: "📅", label: "Appointments" },
  { to: "/treatments", icon: "💊", label: "Treatments" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="w-60 min-h-screen bg-slate-900 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-blue-600 rounded-xl flex items-center justify-center text-lg">
            🦷
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight">
            Denti<span className="text-teal-400">flow</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/30 px-3 mb-3">
          Main Menu
        </p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all ${
                isActive
                  ? "bg-teal-500 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
}