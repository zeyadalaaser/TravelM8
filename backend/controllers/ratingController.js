// controllers/reviewController.js
import Product from '../models/productModel.js';
import Itinerary from '../models/itineraryModel.js';
import Activity from '../models/activityModel.js';
import Rating from '../models/ratingModel.js';
import TourGuide from '../models/tourguideModel.js';
import calculateAverageRating from './calculateAverageRating.js';

export const createReview = async (req, res) => {
    const { userId, entityId, entityType, rating, comment } = req.body;

    if (!userId || !entityId || !entityType || !rating || !comment) {
        return res.status(400).json({
            message: 'Please provide all required fields: userId, entityId, entityType, rating, comment.'
        });
    }

    try {
        const review = await Rating.create({ userId, entityId, entityType, rating, comment });

        const averageRating = await calculateAverageRating(entityId, entityType);

        switch (entityType) {
            case 'Product':
                await Product.findByIdAndUpdate(entityId, { rating: averageRating });
                break;
            case 'Itinerary':
                await Itinerary.findByIdAndUpdate(entityId, { averageRating });
                break;
            case 'Activity':
                await Activity.findByIdAndUpdate(entityId, { averageRating });
                break;
            case 'TourGuide': 
                await TourGuide.findByIdAndUpdate(entityId, { averageRating });
                break;
            default:
                return res.status(400).json({ message: 'Invalid entityType provided.' });
        }

        res.status(201).json({ message: 'Rating submitted successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.', error });
    }
};

export const getReviews = async (req, res) => {
    const { entityId, entityType, touristId } = req.query;

    if (!entityId || !entityType) {
        return res.status(400).json({
            message: 'Please provide both entityId and entityType.'
        });
    }

    try {
        let reviews;

        if (touristId) {
            // If touristId is provided, filter reviews by touristId as well
            reviews = await Rating.find({ entityId, entityType, userId: touristId });
        } else {
            // If touristId is not provided, fetch all reviews for the entity and type
            reviews = await Rating.find({ entityId, entityType });
        }

        if (reviews.length === 0) {
            return res.status(404).json({
                message: 'No reviews found for the provided entity.'
            });
        }

        // Calculate the average rating for the entity
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        res.status(200).json({ reviews, averageRating });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.', error });
    }
};
