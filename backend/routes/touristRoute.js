import express from 'express';
const routerTourist = express.Router();
import { createUser, updateUser, getUsers } from '../controllers/touristController.js';

// Define the routes
routerTourist.post('/addTourist', createUser);              // Create a new user with website, hotline, etc.
routerTourist.put('/updateTourist/:username', updateUser);        // Update user information by email
routerTourist.get('/getTourists', getUsers);                 // Read user by email

export default routerTourist; 