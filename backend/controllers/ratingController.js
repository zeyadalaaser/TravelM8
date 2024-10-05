import Product from '../models/productModel.js'; 
import Rating from '../models/ratingModel.js';

const calculateAverageRating = async (productId) => {
    const reviews = await Rating.find({ entityId: productId, entityType: 'Product' }); 

    if (reviews.length === 0) {
        return null; // or 0 if you prefer no rating yet
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return averageRating;
};

export const createReview = async (req, res) => {
    const { userId, entityId, entityType, rating, comment } = req.body;

    // Check if all required fields are provided
    if (!userId || !entityId || !entityType || !rating || !comment) {
        return res.status(400).json({
            message: 'Please provide all required fields: userId, entityId, entityType, rating, comment.'
        });
    }

    try {
        // Create the new review
        const review = await Rating.create(req.body);

        // Update the average rating for the product
        const averageRating = await calculateAverageRating(entityId);
        await Product.findByIdAndUpdate(entityId, { rating: averageRating });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.', error });
    }
};


