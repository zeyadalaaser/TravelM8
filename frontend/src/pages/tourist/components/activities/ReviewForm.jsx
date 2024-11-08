import { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ activityId, touristId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(""); 
  const submitRating = async () => {
    if (rating === 0 || !comment.trim()) {
      setError("Please provide a valid rating and comment.");
      return;
    }

    try {
      console.log({
        activityId,
        touristId,
        rating,
        comment,
      });

      // Send the request to the backend
      const response = await axios.post("http://localhost:5001/api/ratings", {
        userId: touristId,
        entityId: activityId,
        entityType: 'Activity', 
        rating,
        comment,
      });

      // If successful, alert the user and close the modal
      alert("Rating submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting rating:", error);
      setError("There was an error submitting your rating. Please try again.");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Rate this Activity</h3>

      {/* Display any error message */}
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <div className="mb-3">
        <label>Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="ml-2 border p-1 rounded"
        >
          <option value={0}>Select Rating</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Star{num > 1 && "s"}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={submitRating}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Submit
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
