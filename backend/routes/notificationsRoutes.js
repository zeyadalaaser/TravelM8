import express from "express";
import { getNotifications } from "../controllers/notificationController.js";
import verifyToken from "../services/tokenDecodingService.js";

const router = express.Router();

// Protect the notifications route with the authentication middleware
router.get("/notifications", verifyToken, getNotifications);

export default router;
