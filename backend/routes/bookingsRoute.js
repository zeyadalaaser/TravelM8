import express from 'express';
import {
  createBooking,
  getCompletedToursByTourist, 
} from '../controllers/bookingsController.js';

const router = express.Router();

router.post('/bookings', createBooking); 
router.get('/bookings/completed/:touristId', getCompletedToursByTourist); 
export default router;
