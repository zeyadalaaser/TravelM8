import express from 'express';
import {
  createBooking,
  getCompletedToursByTourist,
  createBooking2,
  getAllTourBookings
} from '../controllers/bookingsController.js';
import verifyToken from '../services/tokenDecodingService.js'

const router = express.Router();

router.post('/bookings', createBooking); 
router.get('/itinerary-bookings', verifyToken, getAllTourBookings);

router.post('/itinerary-bookings', verifyToken, createBooking2);
router.get('/bookings/completed/:touristId', getCompletedToursByTourist); 
export default router;
