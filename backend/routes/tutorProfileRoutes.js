import express from "express";
import {
  getTutorProfile,
  updateTutorProfile,
  deleteTutorProfileItem,
} from "../controllers/tutorProfileController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ===============================
 * Tutor Profile Routes
 * Base: /api/tutor
 * ===============================
 */

/**
 * GET Tutor Profile
 * GET /api/tutor/profile
 */
router.get(
  "/profile",
  protect,            // auth check
  authorize("tutor"), // role check
  getTutorProfile
);

/**
 * UPDATE Tutor Profile
 * PUT /api/tutor/profile
 */
router.put(
  "/profile",
  protect,
  authorize("tutor"),
  updateTutorProfile
);

/**
 * DELETE Tutor Profile Item
 * DELETE /api/tutor/profile/item
 */
router.delete(
  "/profile/item",
  protect,
  authorize("tutor"),
  deleteTutorProfileItem
);

export default router;
