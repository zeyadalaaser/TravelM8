import express from 'express';
import { createReview, getReviews } from '../controllers/ratingController.js';

const router = express.Router();

// Route to create a new review
router.post('/ratings', createReview);
router.get('/ratings', getReviews);

export default router;
