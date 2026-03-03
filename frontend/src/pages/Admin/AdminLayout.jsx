import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#0a1f44] text-white flex items-center justify-between px-4 py-3 z-40">
        <h1 className="font-semibold text-lg">Admin Panel</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="text-2xl"
        >
          ☰
        </button>
      </div>

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed md:relative top-0 left-0 h-full w-64 bg-[#0a1f44] text-white
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          transition-transform duration-300 ease-in-out
          z-50 flex flex-col
        `}
      >
        <div className="p-6 text-xl font-bold border-b border-blue-900">
          Admin Panel
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarLink to="/admin" onClick={() => setIsOpen(false)}>
            Dashboard
          </SidebarLink>
          <SidebarLink to="/admin/users" onClick={() => setIsOpen(false)}>
            Users
          </SidebarLink>
          <SidebarLink to="/admin/posts" onClick={() => setIsOpen(false)}>
            Tutor Posts
          </SidebarLink>
          <SidebarLink to="/admin/requests" onClick={() => setIsOpen(false)}>
            Student Requests
          </SidebarLink>
        </nav>

        <div className="p-4 border-t border-blue-900">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-medium transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ================= OVERLAY (Mobile) ================= */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 overflow-y-auto p-6 mt-14 md:mt-0">
        <Outlet />
      </main>

    </div>
  );
}

function SidebarLink({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        `block px-4 py-2 rounded-md font-medium transition
        ${isActive
          ? "bg-white text-[#0a1f44]"
          : "text-white hover:bg-blue-900"}`
      }
    >
      {children}
    </NavLink>
  );
}