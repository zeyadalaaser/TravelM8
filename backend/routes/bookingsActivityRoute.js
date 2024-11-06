import express from 'express';
import { bookActivity, getCompletedActivities, addReview } from '../controllers/bookingsActivityController.js';

const router = express.Router();

router.post('/bookedactivities/book', bookActivity);
router.get('/bookedactivities/completed/:touristId', getCompletedActivities);
router.post('/bookedactivities/rate', addReview);

export default router;