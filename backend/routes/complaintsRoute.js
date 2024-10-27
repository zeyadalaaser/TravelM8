import express from 'express';
import { createComplaint, getComplaints } from '../controllers/complaintsController.js';
import verifyToken from '../services/tokenDecodingService.js'

const complaintRoute = express.Router();

complaintRoute.post('/complaints',verifyToken, createComplaint);              
complaintRoute.get('/complaints', getComplaints);  

export default complaintRoute;