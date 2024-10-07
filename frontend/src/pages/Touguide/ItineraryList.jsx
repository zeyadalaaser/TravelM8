import React from 'react';
import { Link } from 'react-router-dom';
import './ItineraryList.css';

export default function ItineraryList({ itineraries, onDelete }) {
  return (
    <div className="itinerary-list">
      <h2>My Itineraries</h2>
      {itineraries.map((itinerary) => (
        <div key={itinerary._id} className="itinerary-item">
          <h3>{itinerary.title}</h3>
          <p>Duration: {itinerary.duration}</p>
          <p>Language: {itinerary.language}</p>
          <p>Price: ${itinerary.price}</p>
          <div className="itinerary-actions">
            <Link to={`/view-itinerary/${itinerary._id}`} className="view-button">View</Link>
            <Link to={`/edit-itinerary/${itinerary._id}`} className="edit-button">Edit</Link>
            <button onClick={() => onDelete(itinerary._id)} className="delete-button">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}