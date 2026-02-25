import crypto from "crypto";
import User from "../models/User.js";
import TutorProfile from "../models/TutorModel.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import StudentProfile from "../models/StudentProfile.js";

/* ================= REGISTER STUDENT ================= */
export const registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      studentClass,
      subjects,
      city,
      contact,
    } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !studentClass ||
      !subjects ||
      !city ||
      !contact
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create User (Pending Approval)
    const user = await User.create({
      name,
      email,
      password,
      role: "student",
      isApproved: false, // 🔒 ADMIN APPROVAL REQUIRED
    });

    // Create Student Profile
    await StudentProfile.create({
      user: user._id,
      studentClass,
      subjects,
      city,
      contact,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful. Await admin approval.",
    });
  } catch (err) {
    console.error("Register Student Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= REGISTER TUTOR ================= */
export const registerTutor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      city,
      qualifications,
      subjects,
      grades,
      experienceYears,
      bio,
    } = req.body;

    // Required fields
    if (!name || !email || !password || !phone || !city) {
      return res.status(400).json({ message: "Required fields missing (name, email, password, phone, city)" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password too short" });
    }

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create User
    const user = await User.create({
      name,
      email,
      password,
      role: "tutor",
      isApproved: false,
      emailVerified: false,
    });

    // Format qualifications
    const formattedQualifications = (qualifications || []).map(q =>
      typeof q === "string" ? { degree: q, institute: "", year: "" } : q
    );

    // Create TutorProfile
    await TutorProfile.create({
      user: user._id,
      phone,
      city,
      qualifications: formattedQualifications,
      subjects: subjects || [],
      grades: grades || [],
      experienceYears: experienceYears || 0,
      bio: bio || "",
      isProfileCompleted: true,
    });

    res.status(201).json({
      success: true,
      message: "Tutor registered. Await admin approval.",
    });
  } catch (err) {
    console.error("Register Tutor Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* 🔒 BLOCKED USER CHECK (ALL ROLES) */
if (user.isBlocked) {
  return res.status(403).json({
    message: "Your account has been blocked by admin",
  });
}

/* 🔒 EMAIL VERIFICATION (ONLY TUTOR) */
if (user.role === "tutor" && !user.emailVerified) {
  return res.status(403).json({
    message: "Please verify your email first",
  });
}

/* 🔒 ADMIN APPROVAL (STUDENT + TUTOR) */
if ((user.role === "student" || user.role === "tutor") && !user.isApproved) {
  return res.status(403).json({
    message: "Your account is pending admin approval",
  });
}


    let profileCompleted = true;

    if (user.role === "tutor") {
      const profile = await TutorProfile.findOne({ user: user._id });
      profileCompleted = profile?.isProfileCompleted || false;
    }

    res.json({
      success: true,
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        profileCompleted,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({
        success: true,
        message: "If email exists, reset link sent",
      });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <h3>Password Reset</h3>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Expires in 15 minutes</p>
    `;

    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message,
    });

    res.json({ success: true, message: "Reset email sent" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password too short" });
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      success: true,
      token: generateToken(user),
    });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
