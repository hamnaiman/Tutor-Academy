import express from "express";
import {
  registerStudent,
  registerTutor,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

/* ========= REGISTER ========= */
router.post("/register/student", registerStudent);
router.post("/register/tutor", registerTutor);

/* ========= AUTH ========= */
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
