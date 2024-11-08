import express from 'express';
import { getAllActivityBookings, cancelBooking, bookActivity, getCompletedActivities, createBooking, addReview } from '../controllers/bookingsActivityController.js';
import verifyToken from '../services/tokenDecodingService.js';


const router = express.Router();

router.post('/bookedactivities/book', bookActivity);
router.get('/bookedactivities/completed/:touristId', getCompletedActivities);
router.post('/bookedactivities/rate', addReview);

router.post('/activity-bookings', verifyToken, createBooking);
router.get('/activity-bookings', verifyToken, getAllActivityBookings);
router.put('/activity-bookings/:id', verifyToken, cancelBooking);

export default router;