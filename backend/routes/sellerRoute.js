import express from 'express';
import { createSeller, updateSellerProfile, getSellers, getMyProfile } from '../controllers/sellerController.js';
import verifyToken from '../services/tokenDecodingService.js';
import { changePasswordSeller } from '../controllers/changePassword.js';

const router = express.Router();

// Define the routes
router.post('/sellers', createSeller);
router.put('/sellers/updateMyProfile', verifyToken , updateSellerProfile);       
router.get('/sellers', getSellers);
router.get('/sellers/myProfile', verifyToken , getMyProfile);
router.post("/sellers/changepassword", verifyToken, changePasswordSeller);

export default router; 
