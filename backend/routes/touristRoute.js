import express from "express";
import { registerTourist } from "../controllers/touristController.js";

const router = express.Router();

// Tourist Registration Route
router.post("/register-tourist", registerTourist);

export default router;
