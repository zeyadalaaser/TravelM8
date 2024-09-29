import express from 'express';
const routerTourGuide = express.Router();
import { createUser, updateUser, getUsers } from '../controllers/tourguideController.js';

// Define the routes
routerTourGuide.post('/addTourGuide', createUser);              // Create a new user with website, hotline, etc.
routerTourGuide.put('/updateTourGuide/:username', updateUser);        // Update user information by email
routerTourGuide.get('/getTourGuides', getUsers);                 // Read user by email

export default routerTourGuide; 