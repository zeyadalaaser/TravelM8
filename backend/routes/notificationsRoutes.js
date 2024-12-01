import express from "express";
import { getNotifications, markNotificationAsRead, deleteNotification, clearNotifications } from "../controllers/notificationController.js";
import verifyToken from "../services/tokenDecodingService.js";


const router = express.Router();

router.get("/notifications", verifyToken, getNotifications);
router.patch('/notifications/:id/read', markNotificationAsRead);
router.delete('/notifications/:id', deleteNotification);
router.delete('/notifications', verifyToken ,clearNotifications);


export default router;
