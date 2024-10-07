import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TourismGovernor.css"; // Import the CSS file for styling

const TourismGovernor = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [governors, setGovernors] = useState([]);

  const registerGovernor = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/tourism-governors/register", {
        username,
        password,
      });
      alert(response.data.message);
      fetchGovernors();
    } catch (error) {
      alert(error.response.data.message || "Registration failed");
    }
  };

  const fetchGovernors = async () => {
    try {
      const response = await axios.get("/api/tourism-governors");
      setGovernors(response.data);
    } catch (error) {
      console.error("Error fetching tourism governors:", error);
    }
  };

  useEffect(() => {
    fetchGovernors();
  }, []);

  return (
    <div className="container">
      <h1>Tourism Governor Registration</h1>
      <form onSubmit={registerGovernor}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
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
        <div className="buttons">
          <button type="submit" className="register-button">
            Add
          </button>
          <a href="/user.html" className="back-button">
            Back to Landing Page
          </a>
        </div>
      </form>

      <h2>Add Tourism Governors</h2>
      <ul>
        {governors.map((governor, index) => (
          <li key={index}>{governor.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default TourismGovernor;
