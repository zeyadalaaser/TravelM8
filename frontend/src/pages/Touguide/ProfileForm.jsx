import React, { useState, useEffect } from 'react';
import './ProfileForm.css';

export default function ProfileForm({ profile, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    yearsOfExperience: '',
    previousWork: '',
    languages: [],
    certifications: [],
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h2>Tour Guide Profile</h2>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="mobileNumber">Mobile Number:</label>
        <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="yearsOfExperience">Years of Experience:</label>
        <input type="number" id="yearsOfExperience" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="previousWork">Previous Work:</label>
        <textarea id="previousWork" name="previousWork" value={formData.previousWork} onChange={handleChange}></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="languages">Languages (comma-separated):</label>
        <input type="text" id="languages" name="languages" value={formData.languages.join(', ')} onChange={handleArrayChange} />
      </div>
      <div className="form-group">
        <label htmlFor="certifications">Certifications (comma-separated):</label>
        <input type="text" id="certifications" name="certifications" value={formData.certifications.join(', ')} onChange={handleArrayChange} />
      </div>
      <button type="submit" className="submit-button">Update Profile</button>
    </form>
  );
}