import { useState } from 'react';
import axios from 'axios';

export default function RateProduct({ isOpen, onClose, purchaseId }) {
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');

    if (!isOpen) return null;

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async () => {
        if (!rating) {
            alert("Please select a rating.");
            return;
        }

        try {
            // Use the correct endpoint with purchaseId
            await axios.post(`http://localhost:5001/api/purchases/${purchaseId}/rate`, { rating, comment });
            alert('Rating submitted successfully!');
            onClose(); // Close modal after submission
        } catch (error) {
            console.error("Error submitting rating:", error);
            alert("Failed to submit rating.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm">
                <h2 className="text-xl mb-4">Rate this Product</h2>
                <select 
                    onChange={handleRatingChange} 
                    className="border p-2 mb-2 w-full"
                    value={rating}
                >
                    <option value="">Select a rating</option>
                    {[1, 2, 3, 4, 5].map(star => (
                        <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>
                    ))}
                </select>
                <textarea 
                    placeholder="Leave a comment..." 
                    onChange={handleCommentChange} 
                    value={comment}
                    className="border p-2 mb-2 w-full"
                />
                <div className="flex justify-end">
                    <button 
                        onClick={handleSubmit} 
                        className="bg-black text-white font-semibold py-2 px-4 rounded mr-2"
                    >
                        Submit Rating
                    </button>
                    <button 
                        onClick={onClose} 
                        className="bg-gray-300 text-black font-semibold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
