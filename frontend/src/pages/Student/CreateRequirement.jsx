import { useState } from "react";
import api from "../../api/axios";

const CreateRequirement = () => {
  const [form, setForm] = useState({
    tuitionType: "online",
    city: "",
    area: "",
    grade: "",
    subjects: "",
    preferredTutorGender: "any",
    requiredExperience: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      setLoading(true);
      await api.post("/student/requirements", {
        ...form,
        subjects: form.subjects.split(",").map(s => s.trim()),
      });
      setMsg("Requirement posted successfully ✅");
      e.target.reset();
    } catch (err) {
      console.error(err);
      setMsg("Failed to create requirement ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold text-[#0b1f3a] mb-4">
        Create Tutor Requirement
      </h2>

      {msg && <p className="text-sm mb-3">{msg}</p>}

      <form onSubmit={submit} className="grid gap-4">
        <select name="tuitionType" onChange={handleChange} className="input">
          <option value="online">Online</option>
          <option value="onsite">Onsite</option>
        </select>

        <input name="city" placeholder="City" required onChange={handleChange} className="input" />
        <input name="area" placeholder="Area (optional)" onChange={handleChange} className="input" />
        <input name="grade" placeholder="Class / Grade" required onChange={handleChange} className="input" />

        <input
          name="subjects"
          placeholder="Subjects (comma separated)"
          required
          onChange={handleChange}
          className="input"
        />

        <select name="preferredTutorGender" onChange={handleChange} className="input">
          <option value="any">Any Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          type="number"
          name="requiredExperience"
          placeholder="Required Experience (years)"
          onChange={handleChange}
          className="input"
        />

        <textarea
          name="description"
          placeholder="Additional Notes"
          onChange={handleChange}
          className="input h-24"
        />

        <button
          disabled={loading}
          className="bg-[#0b1f3a] hover:bg-[#102a4d] text-white py-2 rounded-lg"
        >
          {loading ? "Posting..." : "Post Requirement"}
        </button>
      </form>
    </div>
  );
};

export default CreateRequirement;
