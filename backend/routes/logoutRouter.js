import express from 'express';
import { logout } from '../controllers/logoutController.js'; // Import the logout function from the controller
import verifyToken from "../services/tokenDecodingService.js";

const router = express.Router();


router.post('/logout',verifyToken, logout);

export default router;