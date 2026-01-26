import { Link, Outlet } from "react-router-dom";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow p-4 flex gap-6">
        <Link to="create" className="text-blue-600 font-medium">
          Create Requirement
        </Link>
        <Link to="my-requirements" className="text-blue-600 font-medium">
          My Requirements
        </Link>
      </div>

      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentDashboard;
