import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ================= PROTECT ================= */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    /* 🔒 BLOCK CHECK */
    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked by admin" });
    }

    /* 🔒 EMAIL VERIFICATION CHECK (Only tutors) */
    if (user.role === "tutor" && !user.emailVerified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

    /* 🔒 TUTOR APPROVAL CHECK */
    if (user.role === "tutor" && !user.isApproved) {
      return res.status(403).json({ message: "Your account is pending admin approval" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};


/* ================= AUTHORIZE ================= */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
