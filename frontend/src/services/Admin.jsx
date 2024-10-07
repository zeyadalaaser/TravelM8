import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Admin.css"; // Import the CSS file for styling

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [admins, setAdmins] = useState([]);

  // Function to register a new user
  const registerUser = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/admins/register",
        {
          username,
          password,
        }
      );
      alert(response.data.message); // Show success message
      fetchAdmins(); // Refresh the admin list after registration
      setUsername(""); // Clear username field after registration
      setPassword(""); // Clear password field after registration
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed"); // Show error message
    }
  };

  // Function to fetch the list of admins
  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/admins");
      console.log("API Response:", response.data); // Log the response data
      if (Array.isArray(response.data)) {
        setAdmins(response.data); // Set admins only if it's an array
      } else {
        console.error("Expected an array of admins, received:", response.data);
        setAdmins([]); // Reset to an empty array if the response is not as expected
      }
    } catch (error) {
      console.error(
        "Error fetching admins:",
        error.response?.data || error.message
      );
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    const passwordInput = document.getElementById("password");
    const eyeIconOpen = document.getElementById("eyeOpen");
    const eyeIconClose = document.getElementById("eyeClose");

    if (passwordInput.type === "password") {
      passwordInput.type = "text"; // Show password
      eyeIconClose.style.display = "none"; // Hide closed eye
      eyeIconOpen.style.display = "block"; // Show open eye
    } else {
      passwordInput.type = "password"; // Hide password
      eyeIconClose.style.display = "block"; // Show closed eye
      eyeIconOpen.style.display = "none"; // Hide open eye
    }
  };

  // Fetch admins when the component mounts
  useEffect(() => {
    fetchAdmins(); // Fetch and display the list of admins on component mount
  }, []);

  return (
    <div className="admin-container">
      <h1 className="admin-header">Add Admin</h1>
      <form id="registerForm" onSubmit={registerUser}>
        <div className="admin-form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="admin-form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="7"
          />
        </div>
        <div className="admin-buttons">
          <button type="submit" className="admin-register-button">
            Add
          </button>
          <a href="/user.html" className="admin-back-button">
            Back to Landing Page
          </a>
        </div>
      </form>

      <h1 className="admin-header">Admins</h1>
      <ul id="adminList">
        {Array.isArray(admins) && admins.length > 0 ? (
          admins.map((admin, index) => <li key={index}>{admin.username}</li>)
        ) : (
          <li>No admins found.</li> // Display a message if there are no admins
        )}
      </ul>
    </div>
  );
};

export default Admin;