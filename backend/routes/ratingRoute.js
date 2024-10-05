import express from 'express';
import { createReview } from '../controllers/ratingController.js';

const router = express.Router();

// Route to create a new review
router.post('/', createReview);

export default router;
