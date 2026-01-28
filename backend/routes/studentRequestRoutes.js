import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createTutorRequest,
  getMyRequests,
  updateRequest,
  deleteRequest
} from "../controllers/studentRequestController.js";

const router = express.Router();

router.use(protect, authorize("student"));

// CRUD for requests
router.post("/", createTutorRequest);        // 3.7: Create
router.get("/", getMyRequests);             // 3.8: View status
router.put("/:id", updateRequest);          // Edit
router.delete("/:id", deleteRequest);       // Delete

export default router;
