import React, { useState } from 'react';
import axios from 'axios';


const tourguide = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [previousWork, setPreviousWork] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send PUT request to update user data by username
      const response = await axios.put(`http://localhost:5001/api/tourguides/${username}`, {
        email,
        password,
        yearsOfExperience,
        mobileNumber,
        previousWork
      });
      console.log('Response:', response.data);
      alert('User information updated successfully!');
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Failed to update user information.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required // Makes the field mandatory
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required // Makes the field mandatory
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required // Makes the field mandatory
        />
      </div>
      <div>
        <label>Years of Experience:</label>
        <input
          type="number"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
          required // Makes the field mandatory
        />
      </div>
      <div>
        <label>Mobile Number:</label>
        <input
          type="tel"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          required // Makes the field mandatory
        />
      </div>
      <div>
        <label>Previous Work:</label>
        <input
          type="text"
          value={previousWork}
          onChange={(e) => setPreviousWork(e.target.value)}
          required // Makes the field mandatory
        />
      </div>
      <button type="submit">Update User</button>
    </form>
  );
};

export default tourguide;