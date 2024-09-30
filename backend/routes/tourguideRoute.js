import express from 'express';
import { createTourGuide, updateTourGuide, getTourGuides } from '../controllers/tourGuideController.js';


const router = express.Router();

// Define the routes
router.post('/tour-guides', createTourGuide);              // Create a new user with website, hotline, etc.
router.put('/tour-guides/:username', updateTourGuide);        // Update user information by email
router.get('/tour-guides', getTourGuides);                 // Read user by email

export default router; 