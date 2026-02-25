import { useEffect, useState } from "react";
import api from "../../api/axios";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    studentClass: "",
    subjects: "",
    city: "",
    contact: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/student/profile");
        setProfile(data.profile);
        setForm({
          name: data.profile.user.name,
          email: data.profile.user.email,
          studentClass: data.profile.studentClass,
          subjects: data.profile.subjects.join(", "),
          city: data.profile.city,
          contact: data.profile.contact,
        });
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        subjects: form.subjects.split(",").map((s) => s.trim()),
      };

      const { data } = await api.put("/student/profile", payload);
      setProfile(data.profile);
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-navy-700">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-[#0a1f44] mb-6">
          Student Profile
        </h2>

        {message && (
          <div className="mb-4 rounded-lg bg-blue-50 text-[#0a1f44] px-4 py-2 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              label="Class"
              name="studentClass"
              value={form.studentClass}
              onChange={handleChange}
            />
            <Input
              label="Subjects"
              name="subjects"
              value={form.subjects}
              onChange={handleChange}
              placeholder="Math, Physics"
            />
            <Input
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
            />
            <Input
              label="Contact"
              name="contact"
              value={form.contact}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#0a1f44] py-3 text-white font-medium hover:bg-[#14366d] transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;

/* ================= Reusable Input ================= */
const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-[#0a1f44]">
      {label}
    </label>
    <input
      {...props}
      className="rounded-lg border border-gray-300 px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-[#0a1f44]"
    />
  </div>
);
