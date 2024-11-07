import express from 'express';
import { getAllActivityBookings, bookActivity, getCompletedActivities, createBooking, addReview } from '../controllers/bookingsActivityController.js';
import verifyToken from '../services/tokenDecodingService.js';

const router = express.Router();

router.post('/bookedactivities/book', bookActivity);
router.post('/activity-bookings', verifyToken, createBooking);
router.post('/bookedactivities/book', bookActivity);
router.get('/activity-bookings', verifyToken, getAllActivityBookings);
router.get('/bookedactivities/completed/:touristId', getCompletedActivities);
router.post('/bookedactivities/rate', addReview);

export default router;