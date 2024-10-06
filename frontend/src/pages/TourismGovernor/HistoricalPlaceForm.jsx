import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '@/pages/TourismGovernor/HistoricalPlaceForm.css';

export default function HistoricalPlaceForm({ places, onSubmit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    image: '',
    openingHours: { open: '', close: '' },
    price: [
      { type: 'Regular', price: 0 },
      { type: 'Student', price: 0 },
      { type: 'Foreigner', price: 0 },
    ],
    tags: { type: '', historicalPeriod: '' },
  });

  useEffect(() => {
    if (id && places) {
      const place = places.find(p => p._id === id);
      if (place) setFormData(place);
    }
  }, [id, places]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleOpeningHoursChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      openingHours: {
        ...prevData.openingHours,
        [name]: value
      }
    }));
  };

  const handlePriceChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const newPrices = [...prevData.price];
      newPrices[index] = { ...newPrices[index], [name]: value };
      return { ...prevData, price: newPrices };
    });
  };

  const handleTagsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      tags: {
        ...prevData.tags,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (place) => {
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

  return (
    <form onSubmit={handleSubmit} className="historical-place-form">
      <h2>{id ? 'Edit Historical Place' : 'Add New Historical Place'}</h2>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="location">Location:</label>
        <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="image">Image URL:</label>
        <input type="url" id="image" name="image" value={formData.image} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="open">Opening Time:</label>
        <input type="time" id="open" name="open" value={formData.openingHours.open} onChange={handleOpeningHoursChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="close">Closing Time:</label>
        <input type="time" id="close" name="close" value={formData.openingHours.close} onChange={handleOpeningHoursChange} required />
      </div>
      {formData.price.map((price, index) => (
        <div key={price.type} className="form-group">
          <label htmlFor={`price-${price.type}`}>{price.type} Price:</label>
          <input
            type="number"
            id={`price-${price.type}`}
            name="price"
            value={price.price}
            onChange={(e) => handlePriceChange(index, e)}
            min="0"
            step="0.01"
            required
          />
        </div>
      ))}
      <div className="form-group">
        <label htmlFor="type">Type:</label>
        <select id="type" name="type" value={formData.tags.type} onChange={handleTagsChange} required>
          <option value="">Select a type</option>
          <option value="Monuments">Monuments</option>
          <option value="Museums">Museums</option>
          <option value="Religious Sites">Religious Sites</option>
          <option value="Palaces/Castles">Palaces/Castles</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="historicalPeriod">Historical Period:</label>
        <input type="text" id="historicalPeriod" name="historicalPeriod" value={formData.tags.historicalPeriod} onChange={handleTagsChange} />
      </div>
      <button type="submit" className="submit-button">{id ? 'Update' : 'Add'} Historical Place</button>
    </form>
  );
}