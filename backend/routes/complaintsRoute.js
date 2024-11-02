import express from 'express';
import { createComplaint, getComplaints,getMyComplaints, filtercomplaints } from '../controllers/complaintsController.js';
import verifyToken from '../services/tokenDecodingService.js'

const complaintRoute = express.Router();

complaintRoute.post('/complaints',verifyToken, createComplaint);              
complaintRoute.get('/complaints', getComplaints);  
complaintRoute.get('/complaints/myComplaints',verifyToken, getMyComplaints);
complaintRoute.get('/filtercomplaints', filtercomplaints);

export default complaintRoute;