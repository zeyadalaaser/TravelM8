import express from 'express';
import { createTourist, updateTouristProfile, getTourists, getMyProfile } from '../controllers/touristController.js';
import verifyToken from '../services/tokenDecodingService.js';


const touristRoute = express.Router();

// Define the routes
touristRoute.post('/tourists', createTourist);              // Create a new user with website, hotline, etc.
touristRoute.put('/tourists/updateMyProfile', verifyToken , updateTouristProfile);        // Update user information by email
touristRoute.get('/tourists', getTourists);                 // Read user by email
touristRoute.get('/tourists/myProfile', verifyToken , getMyProfile);

export default touristRoute; 