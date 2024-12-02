import express from 'express';
import { getBookingNotifications } from '../controllers/NotifcationTouristController.js';
import verifyToken from '../services/tokenDecodingService.js';

const router = express.Router();

router.get('/', verifyToken, getBookingNotifications);

export default router;