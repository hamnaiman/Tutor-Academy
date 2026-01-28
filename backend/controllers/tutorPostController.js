import TutorPost from "../models/TutorPost.js";

/**
 * Create Tutor Post
 * POST /api/tutor/posts
 * 🔒 Only tutors (approved & not blocked) can create
 */
export const createTutorPost = async (req, res) => {
  try {
    const { subject, grade, fee, city, teachingMode, description, availability } = req.body;

    // Optional: Additional validation
    if (!subject || !grade || !fee || !city || !teachingMode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Blocked tutor cannot create posts
    if (req.user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked" });
    }

    // Ensure tutor is approved
    if (!req.user.isApproved) {
      return res.status(403).json({ message: "Your account is pending admin approval" });
    }

    const post = await TutorPost.create({
      tutor: req.user._id,
      subject,
      grade,
      fee,
      city,
      teachingMode,
      description: description || "",
      availability: availability || [],
      isApproved: false, // Admin approval required
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully, waiting for admin approval",
      post,
    });
  } catch (error) {
    console.error("Create Tutor Post Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
