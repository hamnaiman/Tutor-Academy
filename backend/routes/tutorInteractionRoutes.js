import express from "express";
import { sendTutorRequest } from "../controllers/tutorInteractionController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/tutor/requests/send
 * Tutor sends interest on student request
 */
router.post(
  "/send",
  protect,            // JWT required
  authorize("tutor"), // Only tutors
  sendTutorRequest
);

export default router;
