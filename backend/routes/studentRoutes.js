import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getAllTutors, sendRequestToTutor } from "../controllers/studentController.js";

const router = express.Router();

/* ===== STUDENT PROTECTED ROUTES ===== */
router.use(protect);
router.use(authorize("student")); // Only students can access these routes

// Search & View Tutors
router.get("/tutors", getAllTutors);

// Send Request to Tutor (requestId + tutorId needed)
router.post("/requests/:requestId/:tutorId/apply", sendRequestToTutor);

export default router;
