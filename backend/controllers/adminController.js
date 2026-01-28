import User from "../models/User.js";
import TutorProfile from "../models/TutorModel.js";
import StudentProfile from "../models/StudentProfile.js";
import Post from "../models/TutorPost.js"; // tutor posts
import Request from "../models/TutorRequest.js"; // student requests
import sendEmail from "../utils/sendEmail.js";

/* ================== USERS ================== */

// Get pending user registrations (students + tutors)
export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false }).select("-password");
    res.json({ success: true, pendingUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Approve a user registration
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = true;
    await user.save();

    // Notify user via email
    await sendEmail({
      email: user.email,
      subject: "Registration Approved",
      message: `<p>Your account has been approved by admin. You can now login.</p>`
    });

    res.json({ success: true, message: "User approved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Reject a user registration
export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = false;
    user.isBlocked = true; // optional: block permanently
    await user.save();

    // Notify user
    await sendEmail({
      email: user.email,
      subject: "Registration Rejected",
      message: `<p>Sorry, your registration was rejected by admin.</p>`
    });

    res.json({ success: true, message: "User rejected successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Block / Unblock user
export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = true;
    await user.save();
    res.json({ success: true, message: "User blocked" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = false;
    await user.save();
    res.json({ success: true, message: "User unblocked" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================== POSTS ================== */

// Get all pending tutor posts
export const getPendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "pending" }).populate("tutor", "name email");
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Approve a tutor post
export const approvePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.status = "approved";
    await post.save();

    // Notify tutor
    const tutor = await User.findById(post.tutor);
    await sendEmail({
      email: tutor.email,
      subject: "Post Approved",
      message: `<p>Your tutoring post has been approved by admin.</p>`
    });

    res.json({ success: true, message: "Post approved" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Reject a tutor post
export const rejectPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.status = "rejected";
    await post.save();

    const tutor = await User.findById(post.tutor);
    await sendEmail({
      email: tutor.email,
      subject: "Post Rejected",
      message: `<p>Your tutoring post has been rejected by admin.</p>`
    });

    res.json({ success: true, message: "Post rejected" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================== STUDENT REQUESTS ================== */

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: "pending" }).populate("student", "name email");
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "approved";
    await request.save();

    // Notify student
    const student = await User.findById(request.student);
    await sendEmail({
      email: student.email,
      subject: "Request Approved",
      message: `<p>Your tuition request has been approved by admin.</p>`
    });

    res.json({ success: true, message: "Request approved" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "rejected";
    await request.save();

    const student = await User.findById(request.student);
    await sendEmail({
      email: student.email,
      subject: "Request Rejected",
      message: `<p>Your tuition request has been rejected by admin.</p>`
    });

    res.json({ success: true, message: "Request rejected" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================== DASHBOARD ================== */

export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTutors = await User.countDocuments({ role: "tutor" });
    const totalStudents = await User.countDocuments({ role: "student" });
    const pendingUsers = await User.countDocuments({ isApproved: false });
    const approvedPosts = await Post.countDocuments({ status: "approved" });
    const rejectedPosts = await Post.countDocuments({ status: "rejected" });
    const pendingPosts = await Post.countDocuments({ status: "pending" });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalTutors,
        totalStudents,
        pendingUsers,
        approvedPosts,
        rejectedPosts,
        pendingPosts,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
