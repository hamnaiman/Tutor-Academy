import asyncHandler from "express-async-handler";
import StudentProfile from "../models/StudentProfile.js";
import User from "../models/User.js";

/* ================= VIEW STUDENT PROFILE ================= */
export const getStudentProfile = asyncHandler(async (req, res) => {
  const studentProfile = await StudentProfile.findOne({ user: req.user.id })
    .populate("user", "name email role"); // populate basic user info

  if (!studentProfile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  res.status(200).json({ success: true, profile: studentProfile });
});

/* ================= UPDATE STUDENT PROFILE ================= */
export const updateStudentProfile = asyncHandler(async (req, res) => {
  const { studentClass, subjects, city, contact, name, email } = req.body;

  // Find the profile
  const profile = await StudentProfile.findOne({ user: req.user.id });
  const user = await User.findById(req.user.id);

  if (!profile || !user) {
    return res.status(404).json({ message: "Profile or user not found" });
  }

  // Update fields
  if (studentClass) profile.studentClass = studentClass;
  if (subjects) profile.subjects = subjects;
  if (city) profile.city = city;
  if (contact) profile.contact = contact;

  if (name) user.name = name;
  if (email) user.email = email;

  await profile.save();
  await user.save();

  res.status(200).json({ success: true, message: "Profile updated", profile });
});
