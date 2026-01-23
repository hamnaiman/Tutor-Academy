import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

/* Auth */
import Login from "./pages/Auth/Login";
import StudentRegister from "./pages/Auth/StudentRegister";
import TutorRegister from "./pages/Auth/TutorRegister";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

/* Dashboards */
import StudentDashboard from "./pages/Student/Dashboard";
import TutorDashboard from "./pages/Tutor/Dashboard";
import AdminDashboard from "./pages/Admin/Dashboard";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/tutor" element={<TutorRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Student */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Tutor */}
        <Route
          path="/tutor/dashboard"
          element={
            <ProtectedRoute role="tutor">
              <TutorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="text-center mt-20 text-xl">
              404 | Page Not Found
            </div>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
