import Rating from '../models/ratingModel.js';
import Product from '../models/productModel.js';
import Itinerary from '../models/itineraryModel.js';

const calculateAverageRating = async (entityId, entityType) => {
    const reviews = await Rating.find({ entityId, entityType });

    if (reviews.length === 0) {
        return null; 
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return averageRating;
};

export default calculateAverageRating;
