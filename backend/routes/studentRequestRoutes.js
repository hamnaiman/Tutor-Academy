import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createTutorRequest,
  getMyRequests,
  updateRequest,
  deleteRequest,
} from "../controllers/studentRequestController.js";

const router = express.Router();

router.use(protect);
router.use(authorize("student"));

// CRUD for Tutor Requests
router.post("/requests", createTutorRequest);
router.get("/requests", getMyRequests);
router.put("/requests/:id", updateRequest);
router.delete("/requests/:id", deleteRequest);

export default router;
 