import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { tutorDashboard } from "../controllers/tutorDashboardController.js";

const router = express.Router();

/**
 * GET /api/tutor/dashboard
 * Tutor dashboard overview
 */
router.get("/", protect, authorize("tutor"), tutorDashboard);

export default router;
