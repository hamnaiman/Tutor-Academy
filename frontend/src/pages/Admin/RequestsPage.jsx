import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast, { Toaster } from "react-hot-toast";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  /* ================= FETCH REQUESTS ================= */
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/requests/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.requests);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ================= ACTION HANDLER ================= */
  const action = async (url, msg) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      await api.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(msg);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading Pending Requests...
      </div>
    );
  }

  /* ================= INLINE COMPONENTS ================= */
  const Table = ({ headers, rows }) => (
    <div className="overflow-x-auto rounded-lg border bg-white shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="p-3 text-left font-medium text-gray-600"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="p-4 text-center text-gray-400"
              >
                No pending requests
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr
                key={r.key}
                className="border-t hover:bg-gray-50 transition"
              >
                {r.cells.map((c, i) => (
                  <td key={i} className="p-3">{c}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const Actions = ({ onApprove, onReject, disabled }) => (
    <div className="flex gap-2">
      <button
        disabled={disabled}
        onClick={onApprove}
        className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
      >
        Approve
      </button>
      <button
        disabled={disabled}
        onClick={onReject}
        className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" />

      <h2 className="text-2xl font-semibold mb-6 text-[#0a1f44]">
        Pending Student Requests
      </h2>

      <Table
        headers={["Student", "Email", "Actions"]}
        rows={requests.map((r) => ({
          key: r._id,
          cells: [
            r.student?.name || "N/A",
            r.student?.email || "N/A",
            <Actions
              disabled={actionLoading}
              onApprove={() =>
                action(`/admin/requests/${r._id}/approve`, "Request Approved")
              }
              onReject={() =>
                action(`/admin/requests/${r._id}/reject`, "Request Rejected")
              }
            />,
          ],
        }))}
      />
    </div>
  );
}