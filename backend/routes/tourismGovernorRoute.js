import express from "express";
import { registerGovernor, fetchTourismGovernors } from "../controllers/tourismGovernorController.js";
import verifyToken from '../services/tokenDecodingService.js';
import { changePasswordTourismGovernor } from '../controllers/changePassword.js';

const router = express.Router();

// Tourist Registration Route
router.post("/tourism-governors", registerGovernor);
router.get("/tourism-governors", fetchTourismGovernors);
router.post("/tourism-governors/changepassword", verifyToken, changePasswordTourismGovernor);

export default router;
