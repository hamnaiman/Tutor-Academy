import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function StudentRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    try {
      setLoading(true);
      await api.post("/auth/register/student", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-center text-slate-100 mb-6">
          🎓 Student Registration
        </h2>

        {error && (
          <div className="mb-4 rounded-lg bg-red-900/40 border border-red-700 text-red-300 px-4 py-2 text-sm text-center">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="student@example.com"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Minimum 8 characters"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-500 font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
