import { useState } from "react";
import api from "../../api/axios";

export default function TutorRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    subjects: "",
    experienceYears: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await api.post("/auth/register/tutor", {
        ...form,
        subjects: form.subjects.split(","),
      });
      setSuccess("Your application has been submitted for admin approval.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[#0b1f3a] mb-2">
          Tutor Registration
        </h2>

        <p className="text-center text-slate-500 text-sm mb-6">
          Submit your details to apply as a tutor. Approval is required.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-amber-50 border border-amber-300 text-amber-700 px-4 py-2 text-sm">
            {success}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" name="name" onChange={handleChange} />
          <Input label="Email Address" name="email" type="email" onChange={handleChange} />
          <Input label="Phone Number" name="phone" onChange={handleChange} />
          <Input
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
          />
          <Input
            label="Subjects"
            name="subjects"
            placeholder="Math, Physics, Chemistry"
            onChange={handleChange}
          />
          <Input
            label="Experience (Years)"
            name="experienceYears"
            type="number"
            onChange={handleChange}
          />
        </div>

        {/* Bio */}
        <div className="mt-4">
          <label className="block text-sm text-slate-600 mb-1">
            Short Bio
          </label>
          <textarea
            name="bio"
            rows="4"
            onChange={handleChange}
            placeholder="Brief introduction about your teaching experience"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-[#0b1f3a] hover:bg-[#102a4d] transition text-white font-semibold py-2 disabled:opacity-60"
        >
          {loading ? "Submitting Application..." : "Apply as Tutor"}
        </button>
      </form>
    </div>
  );
}

/* ================= Reusable Input ================= */
function Input({ label, name, type = "text", placeholder, onChange }) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        required
        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>
  );
}
