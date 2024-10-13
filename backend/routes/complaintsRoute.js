import express from 'express';
import { createComplaint, getComplaints } from '../controllers/.complaintsControllerjs';

const complaintRoute = express.Router();

complaintRoute.post('/complaints', createComplaint);              
complaintRoute.get('/complaints', getComplaints);  

export default complaintRoute;