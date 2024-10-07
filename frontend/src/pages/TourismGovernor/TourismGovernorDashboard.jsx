import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import HistoricalPlacesList from '@/pages/TourismGovernor/HistoricalPlacesList.jsx';
import HistoricalPlaceForm from '@/pages/TourismGovernor/HistoricalPlaceForm.jsx';
import HistoricalPlaceDetails from '@/pages/TourismGovernor/HistoricalPlaceDetails.jsx';
import '@/pages/TourismGovernor/TourismGovernorDashboard.css';
import Navbar from '@/pages/TourismGovernor/components/Navbar.jsx';

export default function TourismGovernorDashboard() {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [tourismGovernorId, setTourismGovernorId] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTourismGovernorId();
    fetchHistoricalPlaces();
  }, [navigate, token]);

  const fetchTourismGovernorId = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/getMyGovernor', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTourismGovernorId(data.id);
    } catch (error) {
      console.error('Error fetching tourism governor ID:', error);
    }
  };

  const fetchHistoricalPlaces = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/myPlaces', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setHistoricalPlaces(data.Places);
    } catch (error) {
      console.error('Error fetching historical places:', error);
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
        <Navbar />
      {/* <nav>
        <ul className="nav-list">
          <li><Link to="/" className="nav-link">Dashboard</Link></li>
          <li><Link to="/add" className="nav-link">Add New Historical Place</Link></li>
        </ul>
      </nav> */}

      <Routes>
        <Route path="/" element={<HistoricalPlacesList places={historicalPlaces} onDelete={deleteHistoricalPlace} />} />
        <Route path="/add" element={<HistoricalPlaceForm tourismGovernorId={tourismGovernorId} />} />
        <Route path="/edit/:id" element={<HistoricalPlaceForm places={historicalPlaces}  tourismGovernorId={tourismGovernorId} />} />
        <Route path="/view/:id" element={<HistoricalPlaceDetails places={historicalPlaces} />} />
      </Routes>
    </div>
  );
}
