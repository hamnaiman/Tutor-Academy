import express from "express";
import { publicRequirements } from "../controllers/publicController.js";

const router = express.Router();

router.get("/requirements", publicRequirements);

export default router;
