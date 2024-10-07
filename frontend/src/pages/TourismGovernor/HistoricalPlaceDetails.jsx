import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './HistoricalPlaceDetails.css'; // Import the CSS file
import Navbar from '@/pages/TourismGovernor/components/Navbar.jsx';

const HistoricalPlaceDetails = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/getPlace/${id}`);
        setPlace(response.data);
      } catch (error) {
        setError('Error fetching place details.');
        console.error(error);
      }
    };

    fetchPlace();
  }, [id]);

  if (!place) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="place-details-container">
      <Navbar />
      <h1 className="place-title">{place.name}</h1>
      <p className="place-description">{place.description}</p>
      <img src={place.image} alt={place.name} className="place-image" />
      <div className="place-location">
        <h3>Location</h3>
        <p>Latitude: {place.location.lat}</p>
        <p>Longitude: {place.location.lng}</p>
      </div>
      <div className="place-opening-hours">
        <h3>Opening Hours</h3>
        <p>{place.openingHours.open} - {place.openingHours.close}</p>
      </div>
      <div className="place-prices">
        <h3>Prices</h3>
        <ul>
          {place.price.map((price, index) => (
            <li key={index}>{price.type}: ${price.price}</li>
          ))}
        </ul>
      </div>
      <div className="place-tags">
        <h3>Tags</h3>
        <p>Type: {place.tags.type}</p>
        <p>Historical Period: {place.tags.historicalPeriod}</p>
      </div>
    </div>
  );
};

export default HistoricalPlaceDetails;
