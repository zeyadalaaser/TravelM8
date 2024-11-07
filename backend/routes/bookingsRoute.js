import express from 'express';
import {
  createBooking,
  getCompletedToursByTourist,
  createBooking,
  getAllTourBookings
} from '../controllers/bookingsController.js';
import verifyToken from '../services/tokenDecodingService.js';

const router = express.Router();

router.post('/bookings', createBooking); 
router.get('/bookings/completed/:touristId', getCompletedToursByTourist); 

router.get('/itinerary-bookings', verifyToken, getAllTourBookings);
router.post('/itinerary-bookings', verifyToken, createBooking);

export default router;
