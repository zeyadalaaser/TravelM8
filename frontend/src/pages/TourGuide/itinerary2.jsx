import React, { useRouter, useState, useEffect } from 'react';
import axios from 'axios';
import './itinerary2.css'; // Import the CSS file
// import jwt  from  'jsonwebtoken';

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


  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesRes, tagsRes, historicalSitesRes] = await Promise.all([
          axios.get('http://localhost:5001/api/activities'),
          axios.get('http://localhost:5001/api/preference-tags'),
          axios.get('http://localhost:5001/api/getAllPlaces'),
        ]);

        setActivities(activitiesRes.data);
        console.log(activitiesRes.data);
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
      activities: [selectedActivity],
      historicalSites: [selectedHistoricalSite],
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
      tags: selectedTags,
      tourGuideId: "",
    };

    try {
      const response = await fetch('http://localhost:5001/api/itineraries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itineraryData), // Correctly send the changed fields
      });
      console.log(await response.text());
      alert('Itinerary created successfully');
    } catch (error) {
      console.error('Error creating itinerary:', error);
      alert('Failed to create itinerary.');
    }
  };

  return (
    <div className="form-container"> {/* Add a container for the form */}
      <h2 className="form-title">Create Itinerary</h2> {/* Heading */}
      <form onSubmit={handleSubmit}>
        <label className="label">Name:</label>
        <input
          type="text"
          className="input-text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="label">Description:</label>
        <textarea
          className="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label className="label">Activities:</label>
        <select
          className="select"
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
          required
        >
          <option value="">Select an activity</option>
          {activities.map((activity) => (
            <option key={activity._id} value={activity._id}>
              {activity.title}
            </option>
          ))}
        </select>

        <label className="label">Historical Sites:</label>
        <select
          className="select"
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

        <label className="label">Tour Language:</label>
        <input
          type="text"
          className="input-text"
          value={tourLanguage}
          onChange={(e) => setTourLanguage(e.target.value)}
          required
        />

        <label className="label">Price:</label>
        <input
          type="number"
          className="input-number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label className="label">Available Date:</label>
        <input
          type="date"
          className="input-date"
          value={availableDate}
          onChange={(e) => setAvailableDate(e.target.value)}
          required
        />

        <label className="label">Start Time:</label>
        <input
          type="String"
          className="input-time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />

        <label className="label">End Time:</label>
        <input
          type="String"
          className="input-time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />

        <label className="label">Accessibility:</label>
        <input
          type="text"
          className="input-text"
          value={accessibility}
          onChange={(e) => setAccessibility(e.target.value)}
          required
        />

        <label className="label">Pick-Up Location:</label>
        <input
          type="text"
          className="input-text"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          required
        />

        <label className="label">Drop-Off Location:</label>
        <input
          type="text"
          className="input-text"
          value={dropoffLocation}
          onChange={(e) => setDropoffLocation(e.target.value)}
          required
        />

        <label className="label">Tags:</label>
        <select
          className="select"
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


        <button type="submit" className="button">Create Itinerary</button>
      </form>
    </div>
  );
};

export default ItineraryForm;
