import express from "express";
import { getStudentProfile, updateStudentProfile } from "../controllers/studentProfileController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET own profile (student/admin)
router.get("/", protect, authorize("student", "admin"), getStudentProfile);

// UPDATE own profile (only student)
router.put("/", protect, authorize("student"), updateStudentProfile);

export default router;
