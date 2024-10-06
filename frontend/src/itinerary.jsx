import React, { useState } from 'react';
import axios from 'axios';

const ItineraryManager = () => {
    const [itineraryId, setItineraryId] = useState('');
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
        <h2>Itinerary Manager</h2>
        <form onSubmit={handleUpdateSubmit}>
          <div>
            <label>Itinerary ID:</label>
            <input
              type="text"
              value={itineraryId}
              onChange={(e) => setItineraryId(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Activity:</label>
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Start Date (mm/dd/yyyy):</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>End Date (mm/dd/yyyy):</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Duration:</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Language of Tour:</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Available Dates:</label>
            <input
              type="text"
              value={availableDates}
              onChange={(e) => setAvailableDates(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Available Times:</label>
            <input
              type="text"
              value={availableTimes}
              onChange={(e) => setAvailableTimes(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Accessibility:</label>
            <input
              type="text"
              value={accessibility}
              onChange={(e) => setAccessibility(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Pick-up Location:</label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Drop-off Location:</label>
            <input
              type="text"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              required
            />
          </div>
          <button type="submit">Update Itinerary</button>
        </form>
  
        <h3>Current Itineraries</h3>
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
  