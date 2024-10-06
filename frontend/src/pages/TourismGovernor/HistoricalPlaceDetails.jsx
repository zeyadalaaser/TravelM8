import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '@/pages/TourismGovernor/HistoricalPlaceDetails.css';

export default function HistoricalPlaceDetails({ places }) {
  const { id } = useParams();
  const place = places.find(p => p._id === id);

  if (!place) return <div>Loading...</div>;

  return (
    <div className="historical-place-details">
      <h2>{place.name}</h2>
      <img src={place.image} alt={place.name} className="place-image" />
      <p><strong>Description:</strong> {place.description}</p>
      <p><strong>Location:</strong> {place.location}</p>
      <p><strong>Opening Hours:</strong> {place.openingHours.open} - {place.openingHours.close}</p>
      <div className="price-list">
        <h3>Ticket Prices:</h3>
        <ul>
          {place.price.map(price => (
            <li key={price.type}>{price.type}: ${price.price}</li>
          ))}
        </ul>
      </div>
      <p><strong>Type:</strong> {place.tags.type}</p>
      <p><strong>Historical Period:</strong> {place.tags.historicalPeriod}</p>
      <div className="action-buttons">
        <Link to={`/edit/${place._id}`} className="edit-button">Edit</Link>
        <Link to="/" className="back-button">Back to List</Link>
      </div>
    </div>
  );
}