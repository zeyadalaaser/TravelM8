import express from "express";
import { registerGovernor, fetchTourismGovernors } from "../controllers/tourismGovernorController.js";

const router = express.Router();

// Tourist Registration Route
router.post("/tourism-governors", registerGovernor);
router.get("/tourism-governors", fetchTourismGovernors);

export default router;
