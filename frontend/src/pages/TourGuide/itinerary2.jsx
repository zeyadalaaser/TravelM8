import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItineraryForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [historicalSites, setHistoricalSites] = useState([]);
  const [selectedHistoricalSite, setSelectedHistoricalSite] = useState('');
  const [tourLanguage, setTourLanguage] = useState('');
  const [price, setPrice] = useState('');
  const [availableDate, setAvailableDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [accessibility, setAccessibility] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);
  const [selectedTourGuide, setSelectedTourGuide] = useState('');

  // Fetch activities, tags, historical sites, and tour guides from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesRes, tagsRes, historicalSitesRes] = await Promise.all([
          axios.get('http://localhost:5001/api/activities'),
          axios.get('http://localhost:5001/api/preference-tags'),
          axios.get('http://localhost:5001/api/getAllPlaces')
          
        ]);

        setActivities(activitiesRes.data);
        setTags(tagsRes.data);
        setHistoricalSites(historicalSitesRes.data);
        setTourGuides(tourGuidesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itineraryData = {
      name,
      description,
      activities: [selectedActivity],  // Send the selected activity ID
      historicalSites: [selectedHistoricalSite], // Send the selected historical site ID
      tourLanguage,
      price,
      availableSlots: [
        {
          date: availableDate,
          startTime,
          endTime
        }
      ],
      accessibility,
      pickUpLocation: pickupLocation,
      dropOffLocation: dropoffLocation,
      tags: selectedTags,  // Send selected tags as an array of IDs
      tourGuideId: selectedTourGuide,  // Send selected tour guide ID
    };

    try {
      await axios.post('http://localhost:5001/api/itineraries', itineraryData);
      alert('Itinerary created successfully');
    } catch (error) {
      console.error('Error creating itinerary:', error);
      alert('Failed to create itinerary.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <label>Activities:</label>
      <select
        value={selectedActivity}
        onChange={(e) => setSelectedActivity(e.target.value)}
        required
      >
        <option value="">Select an activity</option>
        {activities.map((activity) => (
          <option key={activity._id} value={activity._id}>
            {activity.name}
          </option>
        ))}
      </select>

      <label>Historical Sites:</label>
      <select
        value={selectedHistoricalSite}
        onChange={(e) => setSelectedHistoricalSite(e.target.value)}
        required
      >
        <option value="">Select a historical site</option>
        {historicalSites.map((site) => (
          <option key={site._id} value={site._id}>
            {site.name}
          </option>
        ))}
      </select>

      <label>Tour Language:</label>
      <input
        type="text"
        value={tourLanguage}
        onChange={(e) => setTourLanguage(e.target.value)}
        required
      />

      <label>Price:</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <label>Available Date:</label>
      <input
        type="date"
        value={availableDate}
        onChange={(e) => setAvailableDate(e.target.value)}
        required
      />

      <label>Start Time:</label>
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
      />

      <label>End Time:</label>
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
      />

      <label>Accessibility:</label>
      <input
        type="text"
        value={accessibility}
        onChange={(e) => setAccessibility(e.target.value)}
        required
      />

      <label>Pick-Up Location:</label>
      <input
        type="text"
        value={pickupLocation}
        onChange={(e) => setPickupLocation(e.target.value)}
        required
      />

      <label>Drop-Off Location:</label>
      <input
        type="text"
        value={dropoffLocation}
        onChange={(e) => setDropoffLocation(e.target.value)}
        required
      />

      <label>Tags:</label>
      <select
        multiple
        value={selectedTags}
        onChange={(e) => setSelectedTags([...e.target.selectedOptions].map(option => option.value))}
        required
      >
        {tags.map((tag) => (
          <option key={tag._id} value={tag._id}>
            {tag.name}
          </option>
        ))}
      </select>

      <label>Tour Guide:</label>
      <select
        value={selectedTourGuide}
        onChange={(e) => setSelectedTourGuide(e.target.value)}
        required
      >
        <option value="">Select a tour guide</option>
        {tourGuides.map((guide) => (
          <option key={guide._id} value={guide._id}>
            {guide.name}
          </option>
        ))}
      </select>

      <button type="submit">Create Itinerary</button>
    </form>
  );
};

export default ItineraryForm;
