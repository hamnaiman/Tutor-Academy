import { useEffect, useState } from "react";
import api from "../../api/axios";

const MyRequirements = () => {
  const [data, setData] = useState([]);

  const load = async () => {
    try {
      const res = await api.get("/student/requirements");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this requirement?")) return;
    await api.delete(`/student/requirements/${id}`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-[#0b1f3a] mb-6">
        My Tutor Requirements
      </h2>

      {data.length === 0 && (
        <p className="text-slate-500">No requirements posted yet.</p>
      )}

      <div className="grid gap-4">
        {data.map((r) => (
          <div key={r._id} className="bg-white rounded-xl p-5 shadow">
            <h3 className="font-semibold">{r.grade}</h3>
            <p className="text-sm text-slate-600">
              {r.subjects.join(", ")} — {r.city}
            </p>

            <button
              onClick={() => remove(r._id)}
              className="mt-3 text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRequirements;
