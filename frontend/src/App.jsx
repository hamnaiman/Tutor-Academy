import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

/* Auth Pages */
import Login from "./pages/Auth/Login";
import StudentRegister from "./pages/Auth/StudentRegister";
import TutorRegister from "./pages/Auth/TutorRegister";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

/* Dashboards */
import StudentDashboard from "./pages/Student/Dashboard";
import TutorDashboard from "./pages/Tutor/Dashboard";
import AdminDashboard from "./pages/Admin/Dashboard";

/* Student Pages */
import CreateRequirement from "./pages/Student/CreateRequirement";
import MyRequirements from "./pages/Student/MyRequirements";

/* Public */
import PublicDashboard from "./pages/PublicDashboard";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<PublicDashboard />} />

        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/tutor" element={<TutorRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================= STUDENT ================= */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="create" replace />} />
          <Route path="create" element={<CreateRequirement />} />
          <Route path="my-requirements" element={<MyRequirements />} />
        </Route>

        {/* ================= TUTOR ================= */}
        <Route
          path="/tutor/dashboard"
          element={
            <ProtectedRoute role="tutor">
              <TutorDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= 404 ================= */}
        <Route
          path="*"
          element={
            <div className="text-center mt-20 text-xl text-slate-600">
              404 | Page Not Found
            </div>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
