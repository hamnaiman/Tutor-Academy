import express from "express";
import {
  getPendingUsers,
  approveUser,
  rejectUser,
  blockUser,
  unblockUser,
  getPendingPosts,
  approvePost,
  rejectPost,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getAdminDashboard,
} from "../controllers/adminController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(authorize("admin"));

// Users
router.get("/users/pending", getPendingUsers);
router.put("/users/:id/approve", approveUser);
router.put("/users/:id/reject", rejectUser);
router.put("/users/:id/block", blockUser);
router.put("/users/:id/unblock", unblockUser);

// Posts
router.get("/posts/pending", getPendingPosts);
router.put("/posts/:id/approve", approvePost);
router.put("/posts/:id/reject", rejectPost);

// Student Requests
router.get("/requests/pending", getPendingRequests);
router.put("/requests/:id/approve", approveRequest);
router.put("/requests/:id/reject", rejectRequest);

// Dashboard
router.get("/dashboard", getAdminDashboard);

export default router;
