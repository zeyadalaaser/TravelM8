import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ItineraryForm.css';

export default function ItineraryForm({ itineraries, onSubmit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activities: [],
    locations: [],
    duration: '',
    language: '',
    price: '',
    availableDates: [],
    accessibility: '',
    pickupLocation: '',
    dropoffLocation: '',
    tags: [],
  });

  useEffect(() => {
    if (id && itineraries) {
      const itinerary = itineraries.find(i => i._id === id);
      if (itinerary) setFormData(itinerary);
    }
  }, [id, itineraries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value.split(',').map(item => item.trim())
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(id, formData);
    navigate('/itineraries');
  };

  return (
    <form onSubmit={handleSubmit} className="itinerary-form">
      <h2>{id ? 'Edit Itinerary' : 'Create New Itinerary'}</h2>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="activities">Activities (comma-separated):</label>
        <input type="text" id="activities" name="activities" value={formData.activities.join(', ')} onChange={handleArrayChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="locations">Locations (comma-separated):</label>
        <input type="text" id="locations" name="locations" value={formData.locations.join(', ')} onChange={handleArrayChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="duration">Duration:</label>
        <input type="text" id="duration" name="duration" value={formData.duration} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="language">Language:</label>
        <input type="text" id="language" name="language" value={formData.language} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="availableDates">Available Dates (comma-separated):</label>
        <input type="text" id="availableDates" name="availableDates" value={formData.availableDates.join(', ')} onChange={handleArrayChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="accessibility">Accessibility:</label>
        <input type="text" id="accessibility" name="accessibility" value={formData.accessibility} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="pickupLocation">Pick-up Location:</label>
        <input type="text" id="pickupLocation" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="dropoffLocation">Drop-off Location:</label>
        <input type="text" id="dropoffLocation" name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="tags">Tags (comma-separated):</label>
        <input type="text" id="tags" name="tags" value={formData.tags.join(', ')} onChange={handleArrayChange} />
      </div>
      <button type="submit" className="submit-button">{id ? 'Update' : 'Create'} Itinerary</button>
    </form>
  );
}