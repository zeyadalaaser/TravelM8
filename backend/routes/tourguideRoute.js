import express from 'express';
import { createTourGuide, updateTourGuideProfile, getTourGuides, getMyProfile, rateTourGuide } from '../controllers/tourguideController.js';
import verifyToken from '../services/tokenDecodingService.js';
import { changePasswordTourGuide } from '../controllers/changePassword.js';


const router = express.Router();

// Define the routes
router.post('/tourguides', createTourGuide);              // Create a new user with website, hotline, etc.
router.put('/tourguides/updateMyProfile',verifyToken, updateTourGuideProfile);        // Update user information by email
router.get('/tourguides', getTourGuides);                 // Read user by email
router.get('/tourguides/myProfile', verifyToken , getMyProfile);

//router.post('/tourguides/rate',rateTourGuide);

router.post("/tourguides/changepassword", verifyToken, changePasswordTourGuide);



export default router; 