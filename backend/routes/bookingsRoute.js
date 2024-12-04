import express from 'express';
import {
  getCompletedToursByTourist, 
  createBooking2,
  getAllTourBookings,
  cancelBooking,
  getItinerariesReport,
} from '../controllers/bookingsController.js';
import verifyToken from '../services/tokenDecodingService.js';

const router = express.Router();
router.get('/bookings/completed/:touristId', getCompletedToursByTourist); 

router.get('/itinerary-bookings', verifyToken, getAllTourBookings);
router.post('/itinerary-bookings', verifyToken, createBooking2);
router.put('/itinerary-bookings/:id', verifyToken, cancelBooking);

router.get('/itinerariesReport', verifyToken,getItinerariesReport);


export default router;
