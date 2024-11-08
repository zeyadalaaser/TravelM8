import { useState } from 'react';
import axios from 'axios';

const RateTourGuide = ({ entityId, touristId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitRating = async () => {
    try {
      await axios.post(`http://localhost:5001/api/ratings`, {
        userId: touristId,
        entityId,          
        entityType: "TourGuide",
        rating,
        comment
      });

      alert("Rating and comment submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting rating:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        alert(`Failed to submit rating: ${error.response.data.message}`);
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Rate this Tour Guide</h3>
      <div className="mb-3">
        <label>Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="ml-2 border p-1"
        >
          <option value={0}>Select Rating</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num} Star{num > 1 && "s"}</option>
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
          disabled={rating === 0 || !comment}
        >
          Submit
        </button>
        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RateTourGuide;
