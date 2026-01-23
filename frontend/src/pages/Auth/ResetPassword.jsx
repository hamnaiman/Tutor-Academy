import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useState } from "react";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await api.post(`/auth/reset-password/${token}`, { password });
    alert("Password reset successful");
  };

  return (
    <form onSubmit={submit}>
      <input type="password" onChange={e => setPassword(e.target.value)} />
      <button>Reset Password</button>
    </form>
  );
}
