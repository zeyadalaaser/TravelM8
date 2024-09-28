
import express from 'express';
import { createUser, updateUser, getUsers } from '../controllers/advertiserController.js'; // Add .js extension

const routerAdvertiser = express.Router();

// Define the routes
routerAdvertiser.post('/addAdvertiser', createUser);      // Create a new user with website, hotline, etc.
routerAdvertiser.put('/updateAdvertiser/:username', updateUser);       // Update user information by email
routerAdvertiser.get('/getAdvertisers', getUsers);         // Read user by email

export default routerAdvertiser;                  // Export router as default



