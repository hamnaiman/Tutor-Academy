import { useState } from "react";
import api from "../../api/axios";

export default function StudentRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    studentClass: "",
    subjects: "",
    city: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };

  const validate = () => {
    if (Object.values(form).some((v) => !v)) {
      return "All fields are required";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return "Invalid email format";
    }
    if (form.password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/^\+?\d{10,15}$/.test(form.contact)) {
      return "Invalid contact number";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register/student", {
        ...form,
        subjects: form.subjects.split(",").map((s) => s.trim()),
      });

      setSuccess("Registration successful. Await admin approval.");
      setForm({
        name: "",
        email: "",
        password: "",
        studentClass: "",
        subjects: "",
        city: "",
        contact: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Student Registration</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
        <Input label="Class" name="studentClass" value={form.studentClass} onChange={handleChange} />
        <Input label="Subjects (comma separated)" name="subjects" value={form.subjects} onChange={handleChange} />
        <Input label="City" name="city" value={form.city} onChange={handleChange} />
        <Input label="Contact Number" name="contact" value={form.contact} onChange={handleChange} />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...props}
        required
        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
