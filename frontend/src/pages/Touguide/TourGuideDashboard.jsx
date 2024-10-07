import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProfileForm from './ProfileForm';
import ItineraryList from './ItineraryList';
import ItineraryForm from './ItineraryForm';
import ItineraryDetails from './ItineraryDetails';
import './TourGuideDashboard.css';

export default function TourGuideDashboard() {
  const [profile, setProfile] = useState(null);
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchItineraries();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/tour-guide/profile');
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchItineraries = async () => {
    try {
      const response = await fetch('/api/tour-guide/itineraries');
      const data = await response.json();
      setItineraries(data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    }
  };

  const updateProfile = async (updatedProfile) => {
    try {
      const response = await fetch('/api/tour-guide/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      });
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const addItinerary = async (newItinerary) => {
    try {
      const response = await fetch('/api/tour-guide/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItinerary),
      });
      const data = await response.json();
      setItineraries([...itineraries, data]);
    } catch (error) {
      console.error('Error adding itinerary:', error);
    }
  };

  const updateItinerary = async (id, updatedItinerary) => {
    try {
      const response = await fetch(`/api/tour-guide/itineraries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItinerary),
      });
      const data = await response.json();
      setItineraries(itineraries.map(itinerary => itinerary._id === id ? data : itinerary));
    } catch (error) {
      console.error('Error updating itinerary:', error);
    }
  };

  const deleteItinerary = async (id) => {
    try {
      await fetch(`/api/tour-guide/itineraries/${id}`, { method: 'DELETE' });
      setItineraries(itineraries.filter(itinerary => itinerary._id !== id));
    } catch (error) {
      console.error('Error deleting itinerary:', error);
    }
  };

  return (
    <Router>
      <div className="tour-guide-dashboard">
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/itineraries">My Itineraries</Link></li>
            <li><Link to="/add-itinerary">Create New Itinerary</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Welcome to Tour Guide Dashboard</h1>} />
          <Route path="/profile" element={<ProfileForm profile={profile} onSubmit={updateProfile} />} />
          <Route path="/itineraries" element={<ItineraryList itineraries={itineraries} onDelete={deleteItinerary} />} />
          <Route path="/add-itinerary" element={<ItineraryForm onSubmit={addItinerary} />} />
          <Route path="/edit-itinerary/:id" element={<ItineraryForm itineraries={itineraries} onSubmit={updateItinerary} />} />
          <Route path="/view-itinerary/:id" element={<ItineraryDetails itineraries={itineraries} />} />
        </Routes>
      </div>
    </Router>
  );
}