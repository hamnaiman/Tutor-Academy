import api from "../../api/axios";
import { useState } from "react";

export default function TutorRegister() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/auth/register/tutor", form);
    alert("Application submitted. Await admin approval.");
  };

  return (
    <form onSubmit={submit}>
      <h2>Tutor Application</h2>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button>Apply</button>
    </form>
  );
}
