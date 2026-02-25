import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ALL ================= */
  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login again.");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [dashboardRes, usersRes, postsRes, requestsRes] = await Promise.all([
        api.get("/admin/dashboard", config),
        api.get("/admin/users/pending", config),
        api.get("/admin/posts/pending", config),
        api.get("/admin/requests/pending", config),
      ]);

      setStats(dashboardRes.data.stats);
      setUsers(usersRes.data.pendingUsers);
      setPosts(postsRes.data.posts);
      setRequests(requestsRes.data.requests);
    } catch (err) {
      console.error("Admin Dashboard Fetch Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch admin data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ================= ACTION HANDLERS ================= */
  const action = async (url) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login again.");

      await api.put(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Action failed");
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading admin dashboard...</div>;
  }

  if (error) {
    return (
      <div className="p-10 text-red-600 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-[#0a1f44] text-white p-4 text-xl font-semibold">
        Admin Dashboard
      </header>

      <div className="p-4 max-w-7xl mx-auto space-y-8">
        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Total Users" value={stats.totalUsers} />
          <Stat label="Tutors" value={stats.totalTutors} />
          <Stat label="Students" value={stats.totalStudents} />
          <Stat label="Pending Users" value={stats.pendingUsers} />
        </div>

        {/* PENDING USERS */}
        <Section title="Pending Users">
          <Table
            headers={["Name", "Email", "Role", "Actions"]}
            rows={users.map((u) => ({
              key: u._id,
              cells: [
                u.name,
                u.email,
                u.role,
                <Actions
                  onApprove={() => action(`/admin/users/${u._id}/approve`)}
                  onReject={() => action(`/admin/users/${u._id}/reject`)}
                />,
              ],
            }))}
          />
        </Section>

        {/* PENDING POSTS */}
        <Section title="Pending Tutor Posts">
          <Table
            headers={["Tutor", "Email", "Actions"]}
            rows={posts.map((p) => ({
              key: p._id,
              cells: [
                p.tutor?.name,
                p.tutor?.email,
                <Actions
                  onApprove={() => action(`/admin/posts/${p._id}/approve`)}
                  onReject={() => action(`/admin/posts/${p._id}/reject`)}
                />,
              ],
            }))}
          />
        </Section>

        {/* PENDING REQUESTS */}
        <Section title="Pending Student Requests">
          <Table
            headers={["Student", "Email", "Actions"]}
            rows={requests.map((r) => ({
              key: r._id,
              cells: [
                r.student?.name,
                r.student?.email,
                <Actions
                  onApprove={() => action(`/admin/requests/${r._id}/approve`)}
                  onReject={() => action(`/admin/requests/${r._id}/reject`)}
                />,
              ],
            }))}
          />
        </Section>
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Stat({ label, value }) {
  return (
    <div className="bg-white shadow rounded p-4 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-[#0a1f44]">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-3 text-[#0a1f44]">{title}</h3>
      {children}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border">
        <thead className="bg-gray-200">
          <tr>
            {headers.map((h) => (
              <th key={h} className="p-2 text-left border">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="p-3 text-center text-gray-500">
                No data
              </td>
            </tr>
          )}
          {rows.map((r) => (
            <tr key={r.key} className="border-t">
              {r.cells.map((c, i) => (
                <td key={i} className="p-2 border">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Actions({ onApprove, onReject }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onApprove}
        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
      >
        Approve
      </button>
      <button
        onClick={onReject}
        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
      >
        Reject
      </button>
    </div>
  );
}
