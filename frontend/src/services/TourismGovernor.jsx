import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TourismGovernor.css"; // Import the CSS file for styling


const TourismGovernor1 = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [governors, setGovernors] = useState([]);

  // Function to register a new tourism governor
  const registerGovernor = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/tourism-governors", // Updated to the correct endpoint
        {
          username,
          password,
        }
      );
      alert(response.data.message);
      fetchGovernors(); // Refresh the governor list after registration
      setUsername(""); // Clear username field after registration
      setPassword(""); // Clear password field after registration
    } catch (error) {
      console.error("Registration error:", error); // Log the error
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  // Function to fetch the list of tourism governors
  const fetchGovernors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/tourism-governors"
      );
      console.log("Governors fetched:", response.data); // Log the fetched data
      setGovernors(response.data);
    } catch (error) {
      console.error("Error fetching tourism governors:", error);
    }
  };

  // Fetch governors when the component mounts
  useEffect(() => {
    fetchGovernors();
  }, []);

  return (
    <div className="tourism-governor-container">
      <h1 className="tourism-governor-header">Add Tourism Governor </h1>
      <form onSubmit={registerGovernor}>
        <div className="tourism-governor-form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="tourism-governor-form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="7"
          />
        </div>
        <div className="tourism-governor-buttons">
          <button type="submit" className="tourism-governor-register-button">
            Add
          </button>
          <a href="/user.html" className="tourism-governor-back-button">
            Back to Landing Page
          </a>
        </div>
      </form>

      <h2>Added Tourism Governors</h2>
      <ul>
        {Array.isArray(governors) && governors.length > 0 ? (
          governors.map((governor, index) => (
            <li key={index}>{governor.username}</li>
          ))
        ) : (
          <li>No governors found.</li>
        )}
      </ul>
    </div>
  );
};

export default TourismGovernor1;