import { useEffect, useState } from 'react';
import axios from 'axios';

export const CompletedToursPage = () => {
  const [completedTours, setCompletedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const touristId = localStorage.getItem("touristId");

  useEffect(() => {
    const fetchCompletedTours = async () => {
      try {
        const response = await axios.get(`/api/bookings/completed/${touristId}`);
        // Check if response.data is an array; if not, default to an empty array
        setCompletedTours(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching completed tours:', error);
        setCompletedTours([]); // Set an empty array on error to avoid map errors
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedTours();
  }, [touristId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Completed Tours</h2>
      {completedTours.length === 0 ? (
        <p>No completed tours found.</p>
      ) : (
        <ul>
          {completedTours.map((tour) => (
            <li key={tour._id} className="border p-4 mb-4">
              <h3>{tour.itinerary?.name}</h3>
              <p>{tour.itinerary?.description}</p>
              <p>Tour Guide: {tour.tourGuide?.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
