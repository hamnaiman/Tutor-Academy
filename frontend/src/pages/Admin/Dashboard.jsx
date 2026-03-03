import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(res.data.stats);

        setChartData([
          { name: "Users", value: res.data.stats.totalUsers },
          { name: "Tutors", value: res.data.stats.totalTutors },
          { name: "Students", value: res.data.stats.totalStudents },
          { name: "Pending Users", value: res.data.stats.pendingUsers },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    };

    fetchStats();
  }, []);

  if (!stats)
    return (
      <div className="h-full flex items-center justify-center text-lg text-gray-600">
        Loading Dashboard...
      </div>
    );

  const COLORS = ["#0a1f44", "#2563EB", "#10B981", "#F59E0B"];

  return (
    <div className="h-full flex flex-col gap-6">

      {/* ===== PROFESSIONAL HEADING ===== */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0a1f44]">
          Activity Insights
        </h2>
        <p className="text-gray-500 mt-1">
          Monitor platform growth, engagement & user distribution
        </p>
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ==== PIE CHART (LEFT SIDE LARGE SCREEN) ==== */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <h3 className="text-xl font-semibold mb-4 text-[#0a1f44]">
            User Distribution
          </h3>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="75%"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ==== STATS CARDS (RIGHT SIDE LARGE SCREEN) ==== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            onClick={() => navigate("/admin/users")}
            color="#0a1f44"
          />
          <StatCard
            label="Tutors"
            value={stats.totalTutors}
            onClick={() => navigate("/admin/posts")}
            color="#2563EB"
          />
          <StatCard
            label="Students"
            value={stats.totalStudents}
            onClick={() => navigate("/admin/requests")}
            color="#10B981"
          />
          <StatCard
            label="Pending Users"
            value={stats.pendingUsers}
            onClick={() => navigate("/admin/users")}
            color="#F59E0B"
          />
        </div>

      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ label, value, onClick, color }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1"
      style={{ borderTop: `4px solid ${color}` }}
    >
      <p className="text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-2 text-[#0a1f44]">
        {value}
      </p>
    </div>
  );
}