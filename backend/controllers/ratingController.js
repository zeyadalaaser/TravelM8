// controllers/reviewController.js
import Product from '../models/productModel.js';
import Itinerary from '../models/itineraryModel.js';
import Rating from '../models/ratingModel.js';
import calculateAverageRating from './calculateAverageRating.js';

export const createReview = async (req, res) => {
    const { userId, entityId, entityType, rating, comment } = req.body;

    // Validate the required fields
    if (!userId || !entityId || !entityType || !rating || !comment) {
        return res.status(400).json({
            message: 'Please provide all required fields: userId, entityId, entityType, rating, comment.'
        });
    }

    try {
        // Create a new review entry
        const review = await Rating.create({ userId, entityId, entityType, rating, comment });

        // Calculate the new average rating
        const averageRating = await calculateAverageRating(entityId, entityType);

        // Update the average rating based on entity type
        if (entityType === 'Product') {
            await Product.findByIdAndUpdate(entityId, { rating: averageRating });
        } else if (entityType === 'Itinerary') {
            await Itinerary.findByIdAndUpdate(entityId, { averageRating });
        } else {
            return res.status(400).json({ message: 'Invalid entityType provided.' });
        }

        res.status(201).json({ message: 'Rating submitted successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.', error });
    }
};
