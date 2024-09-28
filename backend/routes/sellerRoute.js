import express from 'express';
const routerSeller = express.Router();
import { createUser, updateUser, getUsers } from '../controllers/sellerController.js';

// Define the routes
routerSeller.post('/addSeller', createUser);              // Create a new user with website, hotline, etc.
routerSeller.put('/updateSeller/:username', updateUser);        // Update user information by email
routerSeller.get('/getSellers', getUsers);                 // Read user by email

export default routerSeller; 
