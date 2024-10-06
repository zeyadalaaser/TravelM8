import React, { useState, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import HistoricalPlacesList from '@/pages/TourismGovernor/HistoricalPlacesList.jsx';
import HistoricalPlaceForm from '@/pages/TourismGovernor/HistoricalPlaceForm.jsx';
import HistoricalPlaceDetails from '@/pages/TourismGovernor/HistoricalPlaceDetails.jsx';
import '@/pages/TourismGovernor/TourismGovernorDashboard.css';

export default function TourismGovernorDashboard() {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);

  useEffect(() => {
    // Fetch historical places from API
    fetchHistoricalPlaces();
  }, []);

  const fetchHistoricalPlaces = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/getAllPlaces');
      const data = await response.json();
      setHistoricalPlaces(data);
    } catch (error) {
      console.error('Error fetching historical places:', error);
    }
  };

  const addHistoricalPlace = async (place) => {
    try {
      const response = await fetch('http://localhost:5001/api/addPlace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(place),
      });
      const newPlace = await response.json();
      setHistoricalPlaces([...historicalPlaces, newPlace]);
    } catch (error) {
      console.error('Error adding historical place:', error);
    }
  };

  const updateHistoricalPlace = async (id, updatedPlace) => {
    try {
      const response = await fetch(`http://localhost:5001/api/updatePlace/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlace),
      });
      const updated = await response.json();
      setHistoricalPlaces(historicalPlaces.map(place => place._id === id ? updated : place));
    } catch (error) {
      console.error('Error updating historical place:', error);
    }
  };

  const deleteHistoricalPlace = async (id) => {
    try {
      await fetch(`http://localhost:5001/api/deletePlace/${id}`, { method: 'DELETE' });
      setHistoricalPlaces(historicalPlaces.filter(place => place._id !== id));
    } catch (error) {
      console.error('Error deleting historical place:', error);
    }
  };

  return (
    <div className="tourism-governor-dashboard">
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/add">Add New Historical Place</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HistoricalPlacesList places={historicalPlaces} onDelete={deleteHistoricalPlace} />} />
        <Route path="/add" element={<HistoricalPlaceForm onSubmit={addHistoricalPlace} />} />
        <Route path="/edit/:id" element={<HistoricalPlaceForm places={historicalPlaces} onSubmit={updateHistoricalPlace} />} />
        <Route path="/view/:id" element={<HistoricalPlaceDetails places={historicalPlaces} />} />
      </Routes>
    </div>
  );
}
