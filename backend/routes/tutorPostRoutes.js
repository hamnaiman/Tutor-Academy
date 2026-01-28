import express from "express";
import { createTutorPost } from "../controllers/tutorPostController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/tutor/posts
 * Tutor creates a teaching post (admin approval required)
 */
router.post(
  "/",               // mounted at /api/tutor/posts
  protect,           // JWT token required
  authorize("tutor"), // Only tutors
  createTutorPost
);

export default router;
