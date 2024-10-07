import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '@/pages/TourismGovernor/components/Navbar.jsx'; // Import the Navbar component
import './HistoricalPlaceForm.css'; // Import your CSS file

export default function HistoricalPlaceForm({ tourismGovernorId, onSubmit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: { lat: '', lng: '' },
    image: '',
    openingHours: { open: '', close: '' },
    price: [
      { type: 'Regular', price: 0 },
      { type: 'Student', price: 0 },
      { type: 'Foreigner', price: 0 },
    ],
    tags: { type: '', historicalPeriod: '' },
  });

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:5001/api/getPlace/${id}`);
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
          setErrorMessage('Error fetching place data.');
        }
      };
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newPlace = { ...formData, tourismGovernorId };

    try {
      if (id) {
        await axios.put(`http://localhost:5001/api/updatePlace/${id}`, newPlace, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Place updated successfully!');
      } else {
        await axios.post('http://localhost:5001/api/addPlace', newPlace, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Place added successfully!');
      }
      setErrorMessage('');
      navigate('/TourismGovernorDashboard');
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Failed to submit form. Please try again.');
      setMessage('');
    }
  };

  return (
    <>
      <Navbar /> {/* Render the Navbar */}
      <form className="historical-place-form" onSubmit={handleSubmit}>
        <h2>{id ? "Edit Place" : "Add New Place"}</h2>
        {message && <div className="success-message">{message}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Location Latitude:</label>
          <input type="number" name="lat" value={formData.location.lat} onChange={e => setFormData({ ...formData, location: { ...formData.location, lat: e.target.value } })} required />
        </div>
        <div className="form-group">
          <label>Location Longitude:</label>
          <input type="number" name="lng" value={formData.location.lng} onChange={e => setFormData({ ...formData, location: { ...formData.location, lng: e.target.value } })} required />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Opening Hours - Open:</label>
          <input type="text" name="open" value={formData.openingHours.open} onChange={e => setFormData({ ...formData, openingHours: { ...formData.openingHours, open: e.target.value } })} required />
        </div>
        <div className="form-group">
          <label>Opening Hours - Close:</label>
          <input type="text" name="close" value={formData.openingHours.close} onChange={e => setFormData({ ...formData, openingHours: { ...formData.openingHours, close: e.target.value } })} required />
        </div>
          <div className="form-group" >
            <label>Price For Natives:</label>
            <input type="text" name="type" value={formData.price.type} onChange={e => setFormData({ ...formData, price: { ...formData.price, type: e.target.value } })} required />
            <label>Price:</label>
            <input type="number" name="price" value={formData.price.price} onChange={e => setFormData({ ...formData, price: { ...formData.price, price: e.target.value } })} required />
          </div>
          <div className="form-group" >
            <label>Price For Students:</label>
            <input type="text" name="type" value={formData.price.type} onChange={e => setFormData({ ...formData, price: { ...formData.price, type: e.target.value } })} required />
          </div>
          <div className="form-group" >
            <label>Price For Foreigners:</label>
            <input type="number" name="price" value={formData.price.price} onChange={e => setFormData({ ...formData, price: { ...formData.price, price: e.target.value } })} required />
          </div>
        <div className="form-group">
          <label>Tags Type:</label>
          <select
            name="type"
            value={formData.tags.type}
            onChange={e => setFormData({ ...formData, tags: { ...formData.tags, type: e.target.value } })}
          >
            <option value="">Select a type</option>
            <option value="museum">Museum</option>
            <option value="Palaces/castles">Palaces/Castles</option>
            <option value="monument">Monument</option>
            <option value="religious site">Religious Site</option>
          </select>
        </div>
        <div className="form-group">
          <label>Historical Period:</label>
          <input type="text" name="historicalPeriod" value={formData.tags.historicalPeriod} onChange={e => setFormData({ ...formData, tags: { ...formData.tags, historicalPeriod: e.target.value } })} />
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </>
  );
}