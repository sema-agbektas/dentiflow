import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="ml-60 flex-1 p-7">
        {children}
      </main>
    </div>
  );
}