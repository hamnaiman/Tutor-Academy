import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/student/dashboard");
        setDashboard(data.dashboard);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#0a1f44]">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ================= NAVBAR ================= */}
      <div className="bg-white shadow flex gap-6 px-6 py-4">
        <span className="font-semibold text-[#0a1f44]">
          Dashboard
        </span>

        <Link
          to="/student/create"
          className="text-blue-600 font-medium"
        >
          Create Requirement
        </Link>

        <Link
          to="/student/my-requirements"
          className="text-blue-600 font-medium"
        >
          My Requirements
        </Link>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-6 space-y-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold text-[#0a1f44]">
            Welcome, {dashboard.profile.user.name}
          </h3>
          <p className="text-sm text-gray-600">
            Class: {dashboard.profile.studentClass}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="My Requests"
            value={dashboard.requests.length}
          />
          <StatCard
            title="Available Tutors"
            value={dashboard.availableTutors.length}
          />
          <StatCard
            title="Subjects"
            value={dashboard.profile.subjects.length}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

/* ================= STAT CARD ================= */
const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-6 text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold text-[#0a1f44]">{value}</p>
  </div>
);
