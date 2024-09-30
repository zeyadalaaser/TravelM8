import express from 'express';
import { createTourist, updateTourist, getTourists } from '../controllers/touristController.js';


const router = express.Router();

// Define the routes
router.post('/tourists', createTourist);              // Create a new user with website, hotline, etc.
router.put('/tourists/:username', updateTourist);        // Update user information by email
router.get('/tourists', getTourists);                 // Read user by email

export default router; 