import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profileTemplate.css';


const ItineraryManager = () => {
    const [itineraryId, setItineraryId] = useState('');
    const [name, setname] = useState('');
    const [activity, setActivity] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [duration, setDuration] = useState('');
    const [language, setLanguage] = useState('');
    const [price, setPrice] = useState('');
    const [availableDates, setAvailableDates] = useState('');
    const [availableTimes, setAvailableTimes] = useState('');
    const [accessibility, setAccessibility] = useState('');
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [itineraries, setItineraries] = useState([]);
  
    useEffect(() => {
      // Fetch itineraries from the backend when the component mounts
      const fetchItineraries = async () => {
        try {
          const response = await axios.get('http://localhost:5001/api/itineraries');
          setItineraries(response.data);
        } catch (error) {
          console.error('Error fetching itineraries:', error);
        }
      };
      fetchItineraries();
    }, []);
  
    const handleUpdateSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await axios.put(`http://localhost:5001/api/itineraries/${itineraryId}`, {
          activity,
          location,
          startDate,
          endDate,
          duration,
          language,
          price,
          availableDates,
          availableTimes,
          accessibility,
          pickupLocation,
          dropoffLocation,
        });
        console.log('Response:', response.data);
        alert('Itinerary updated successfully!');
        // Refresh the itinerary list
        setItineraries((prev) =>
          prev.map((itinerary) =>
            itinerary.id === itineraryId ? { ...itinerary, ...response.data } : itinerary
          )
        );
      } catch (error) {
        console.error('Error updating itinerary:', error);
        alert('Failed to update itinerary.');
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await axios.delete(`http://localhost:5001/api/itineraries/${id}`);
        alert('Itinerary deleted successfully!');
        setItineraries((prev) => prev.filter((itinerary) => itinerary.id !== id));
      } catch (error) {
        console.error('Error deleting itinerary:', error);
        alert('Failed to delete itinerary.');
      }
    };
  
    return (
      <div>
        <ul>
          {itineraries.map((itinerary) => (
            <li key={itinerary.id}>
              <div>
                <strong>Activity:</strong> {itinerary.activity}, <strong>Location:</strong> {itinerary.location}
              </div>
              <div>
                <button onClick={() => handleDelete(itinerary.id)}>Delete Itinerary</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ItineraryManager;
  