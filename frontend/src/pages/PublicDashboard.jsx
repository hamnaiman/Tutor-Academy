import { useEffect, useState } from "react";
import api from "../api/axios";

const PublicDashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/public/requirements").then((res) => setData(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold text-[#0b1f3a] mb-8">
        Available Tutor Requirements
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {data.map((r) => (
          <div key={r._id} className="bg-white rounded-2xl p-6 shadow">
            <h3 className="font-semibold text-lg">{r.grade}</h3>
            <p className="text-sm text-slate-600 mt-1">
              {r.subjects.join(", ")}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {r.city} • Posted by {r.student.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicDashboard;
