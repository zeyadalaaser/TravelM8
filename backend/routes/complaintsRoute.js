import express from 'express';
import { createComplaint, getComplaints, getMyComplaints,updateComplaintStatus } from '../controllers/complaintsController.js';
import verifyToken from '../services/tokenDecodingService.js'

const complaintRoute = express.Router();

complaintRoute.post('/complaints',verifyToken, createComplaint);              
complaintRoute.get('/complaints', getComplaints);  
complaintRoute.get('/complaints/myComplaints',verifyToken, getMyComplaints);
complaintRoute.put('/complaints/:id/status', updateComplaintStatus);

export default complaintRoute;