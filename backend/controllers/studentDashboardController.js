import asyncHandler from "express-async-handler";
import StudentProfile from "../models/StudentProfile.js";
import TutorRequest from "../models/TutorRequest.js";
import TutorProfile from "../models/TutorModel.js";
import User from "../models/User.js";

// GET STUDENT DASHBOARD
export const getStudentDashboard = asyncHandler(async (req, res) => {
  // 1️⃣ Fetch student profile
  const profile = await StudentProfile.findOne({ user: req.user.id })
    .populate("user", "name email isApproved");

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  // 2️⃣ Fetch student requests
  const requests = await TutorRequest.find({ student: req.user.id })
    .populate("assignedTutor", "user subjects grades experienceYears")
    .sort({ createdAt: -1 });

  // 3️⃣ Fetch approved & active tutors
  const tutors = await TutorProfile.find({ isProfileCompleted: true })
    .populate("user", "name email isApproved isBlocked")
    .sort({ experienceYears: -1 });

  // Only include tutors who are approved and not blocked
  const availableTutors = tutors.filter(
    (t) => t.user.isApproved && !t.user.isBlocked
  );

  res.status(200).json({
    success: true,
    dashboard: {
      profile,
      requests,
      availableTutors,
    },
  });
});
