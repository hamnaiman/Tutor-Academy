import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast, { Toaster } from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const viewDetails = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(res.data);
      setModalOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const action = async (method, url, message) => {
    try {
      const token = localStorage.getItem("token");
      await api[method](url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(message);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading users...</div>;

  const pendingUsers = users.filter(u => !u.isApproved);
  const approvedUsers = users.filter(u => u.isApproved);

  /* ================= RESPONSIVE TABLE / CARDS ================= */
  const TableOrCards = ({ title, data, showApprove }) => (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-4 text-[#0a1f44]">
        {title} ({data.length})
      </h3>

      {/* Table for medium+ screens */}
      <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              data.map(u => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">
                    {u.isBlocked ? (
                      <span className="text-red-600 font-medium">Blocked</span>
                    ) : u.isApproved ? (
                      <span className="text-green-600 font-medium">Approved</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">Pending</span>
                    )}
                  </td>
                  <td className="p-3 flex gap-2 flex-wrap">
                    <button
                      onClick={() => viewDetails(u._id)}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-xs"
                    >
                      View
                    </button>
                    {showApprove && (
                      <button
                        onClick={() =>
                          action("put", `/admin/users/${u._id}/approve`, "User Approved")
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                      >
                        Approve
                      </button>
                    )}
                    {u.isBlocked ? (
                      <button
                        onClick={() =>
                          action("put", `/admin/users/${u._id}/unblock`, "User Unblocked")
                        }
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          action("put", `/admin/users/${u._id}/block`, "User Blocked")
                        }
                        className="px-3 py-1 bg-yellow-600 text-white rounded text-xs"
                      >
                        Block
                      </button>
                    )}
                    <button
                      onClick={() =>
                        action("delete", `/admin/users/${u._id}`, "User Deleted")
                      }
                      className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for small screens */}
      <div className="md:hidden grid gap-4">
        {data.length === 0 ? (
          <div className="p-4 text-center text-gray-400">No users found</div>
        ) : (
          data.map(u => (
            <div key={u._id} className="bg-white shadow rounded-lg p-4">
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-gray-600">{u.email}</p>
              <p className="capitalize text-sm">
                <span className="font-medium">Role:</span> {u.role}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span>{" "}
                {u.isBlocked ? "Blocked" : u.isApproved ? "Approved" : "Pending"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => viewDetails(u._id)}
                  className="px-2 py-1 bg-gray-600 text-white rounded text-xs"
                >
                  View
                </button>
                {showApprove && (
                  <button
                    onClick={() =>
                      action("put", `/admin/users/${u._id}/approve`, "User Approved")
                    }
                    className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                  >
                    Approve
                  </button>
                )}
                {u.isBlocked ? (
                  <button
                    onClick={() =>
                      action("put", `/admin/users/${u._id}/unblock`, "User Unblocked")
                    }
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      action("put", `/admin/users/${u._id}/block`, "User Blocked")
                    }
                    className="px-2 py-1 bg-yellow-600 text-white rounded text-xs"
                  >
                    Block
                  </button>
                )}
                <button
                  onClick={() =>
                    action("delete", `/admin/users/${u._id}`, "User Deleted")
                  }
                  className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" />

      <h2 className="text-2xl font-semibold mb-8 text-[#0a1f44]">
        User Management
      </h2>

      {/* Pending Users */}
      <TableOrCards title="Pending Users" data={pendingUsers} showApprove={true} />

      {/* Approved Users */}
      <TableOrCards title="Approved Users" data={approvedUsers} showApprove={false} />

      {/* ================= MODAL ================= */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">{selectedUser.user.name} - Details</h3>

            <p><strong>Email:</strong> {selectedUser.user.email}</p>
            <p><strong>Role:</strong> {selectedUser.user.role}</p>
            <p><strong>Status:</strong> {selectedUser.user.isApproved ? "Approved" : "Pending"}</p>
            {selectedUser.profile && (
              <>
                {selectedUser.user.role === "student" && (
                  <>
                    <p><strong>Class:</strong> {selectedUser.profile.studentClass}</p>
                    <p><strong>Subjects:</strong> {selectedUser.profile.subjects?.join(", ")}</p>
                    <p><strong>City:</strong> {selectedUser.profile.city}</p>
                    <p><strong>Contact:</strong> {selectedUser.profile.contact}</p>
                  </>
                )}
                {selectedUser.user.role === "tutor" && (
                  <>
                    <p><strong>Phone:</strong> {selectedUser.profile.phone}</p>
                    <p><strong>City:</strong> {selectedUser.profile.city}</p>
                    <p><strong>Qualifications:</strong> {selectedUser.profile.qualifications?.map(q => `${q.degree} - ${q.institute} (${q.year})`).join(", ")}</p>
                    <p><strong>Subjects:</strong> {selectedUser.profile.subjects?.join(", ")}</p>
                    <p><strong>Grades:</strong> {selectedUser.profile.grades?.join(", ")}</p>
                    <p><strong>Experience:</strong> {selectedUser.profile.experienceYears} years</p>
                    <p><strong>Mode:</strong> {selectedUser.profile.teachingMode}</p>
                  </>
                )}
              </>
            )}

            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}