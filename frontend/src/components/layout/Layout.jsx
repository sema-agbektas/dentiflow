import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed z-30 lg:static lg:block ${sidebarOpen ? "block" : "hidden"} lg:block`}>
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 bg-slate-900 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white text-xl"
          >
            ☰
          </button>
          <span className="text-white font-bold">
            Denti<span className="text-teal-400">flow</span>
          </span>
        </div>

        <main className="flex-1 p-4 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}