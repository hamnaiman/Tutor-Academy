import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    try {
      setLoading(true);
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess("Password reset successfully. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl"
      >
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-[#0b1f3a] mb-2">
          Reset Password
        </h2>
        <p className="text-center text-sm text-slate-500 mb-6">
          Enter your new password below
        </p>

        {/* Alerts */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-2 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-700 px-4 py-2 text-sm text-center">
            {success}
          </div>
        )}

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm text-slate-600 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            required
            className="w-full rounded-lg bg-white border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full rounded-lg bg-[#0b1f3a] hover:bg-[#102a4d] transition text-white font-semibold py-2 disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
