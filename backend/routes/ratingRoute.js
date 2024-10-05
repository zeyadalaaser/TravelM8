import express from 'express';
import { createReview } from '../controllers/ratingController.js';

const router = express.Router();

// Route to create a new review
router.post('/ratings', createReview);

export default router;
