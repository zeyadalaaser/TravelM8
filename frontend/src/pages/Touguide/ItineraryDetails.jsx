import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './ItineraryDetails.css';

export default function ItineraryDetails({ itineraries }) {
  const { id } = useParams();
  const itinerary = itineraries.find(i => i._id === id);

  if (!itinerary) return <div>Loading...</div>;

  return (
    <div className="itinerary-details">
      <h2>{itinerary.title}</h2>
      <p><strong>Description:</strong> {itinerary.description}</p>
      <div className="details-section">
        <h3>Activities:</h3>
        <ul>
          {itinerary.activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>
      <div className="details-section">
        <h3>Locations:</h3>
        <ul>
          {itinerary.locations.map((location, index) => (
            <li key={index}>{location}</li>
          ))}
        </ul>
      </div>
      <p><strong>Duration:</strong> {itinerary.duration}</p>
      <p><strong>Language:</strong> {itinerary.language}</p>
      <p><strong>Price:</strong> ${itinerary.price}</p>
      <div className="details-section">
        <h3>Available Dates:</h3>
        <ul>
          {itinerary.availableDates.map((date, index) => (
            <li key={index}>{date}</li>
          ))}
        </ul>
      </div>
      <p><strong>Accessibility:</strong> {itinerary.accessibility}</p>
      <p><strong>Pick-up Location:</strong> {itinerary.pickupLocation}</p>
      <p><strong>Drop-off Location:</strong> {itinerary.dropoffLocation}</p>
      <div className="details-section">
        <h3>Tags:</h3>
        <ul>
          {itinerary.tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
      </div>
      <div className="action-buttons">
        <Link to={`/edit-itinerary/${itinerary._id}`} className="edit-button">Edit</Link>
        <Link to="/itineraries" className="back-button">Back to List</Link>
      </div>
    </div>
  );
}