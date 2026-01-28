import TutorProfile from "../models/TutorModel.js";
import TutorPost from "../models/TutorPost.js";
import TutorRequest from "../models/TutorRequest.js";

/**
 * GET Tutor Dashboard
 * GET /api/tutor/dashboard
 * Returns profile status, tutor posts, and student requests
 */
export const tutorDashboard = async (req, res) => {
  try {
    // Ensure tutor is approved
    if (!req.user.isApproved || req.user.isBlocked) {
      return res.status(403).json({
        message: "Access denied. Your account is not approved or blocked.",
      });
    }

    // Tutor profile
    const profile = await TutorProfile.findOne({ user: req.user._id });

    // Tutor's posts
    const posts = await TutorPost.find({ tutor: req.user._id });

    // Open student requests (all open requests, admin-approved)
    const studentRequests = await TutorRequest.find({ status: "open" });

    res.json({
      success: true,
      profileStatus: profile?.isProfileCompleted ? "completed" : "pending",
      posts,
      studentRequests,
    });
  } catch (error) {
    console.error("Tutor Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
