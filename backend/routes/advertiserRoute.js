import express from 'express';
import { createAdvertiser, updateAdvertiserProfile, getAdvertisers, getMyProfile } from '../controllers/advertiserController.js'; // Add .js extension
import verifyToken from '../services/tokenDecodingService.js';
import { changePasswordAdvertiser } from '../controllers/changePassword.js';

const router = express.Router();

// Define the routes
router.post('/advertisers', createAdvertiser);
router.put('/advertisers/updateMyProfile', verifyToken ,updateAdvertiserProfile);
router.get('/advertisers', getAdvertisers);
router.get('/advertisers/myProfile', verifyToken , getMyProfile);
router.post("/advertisers/changepassword", verifyToken, changePasswordAdvertiser);

export default router;


