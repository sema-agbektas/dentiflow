import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      {isOpen && (
        <div className="fixed z-30 top-0 left-0">
          <Sidebar />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 bg-slate-900 px-4 py-3 sticky top-0 z-10">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white text-xl font-bold px-2"
        >
          ☰
        </button>
        <span className="text-white font-bold text-lg">
          Denti<span className="text-teal-400">flow</span>
        </span>
      </div>

      {/* Content */}
      <main className="p-4 lg:p-7">
        {children}
      </main>
    </div>
  );
}