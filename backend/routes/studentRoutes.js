import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getAllTutors, sendRequestToTutor } from "../controllers/studentController.js";

const router = express.Router();

router.use(protect, authorize("student"));

// 3.9: View tutor list
router.get("/tutors", getAllTutors);

// 3.7/3.12: Send request to tutor
router.post("/requests/:requestId/:tutorId/apply", sendRequestToTutor);

export default router;
