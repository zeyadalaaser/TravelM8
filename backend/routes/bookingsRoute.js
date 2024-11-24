import express from 'express';
import {
  createBooking,
  getCompletedToursByTourist, 
  createBooking2,
  getAllTourBookings,
  cancelBooking,
  getItinerariesReport,
} from '../controllers/bookingsController.js';
import verifyToken from '../services/tokenDecodingService.js';

const router = express.Router();

router.post('/bookings', createBooking); 
router.get('/bookings/completed/:touristId', getCompletedToursByTourist); 

router.get('/itinerary-bookings', verifyToken, getAllTourBookings);
router.post('/itinerary-bookings', verifyToken, createBooking2);
router.put('/itinerary-bookings/:id', verifyToken, cancelBooking);

router.get('/itinerariesReport', getItinerariesReport);


export default router;
