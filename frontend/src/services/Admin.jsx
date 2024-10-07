import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Admin.css"; // Import the CSS file for styling

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [admins, setAdmins] = useState([]);

  const registerUser = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/admins/register", {
        username,
        password,
      });
      alert(response.data.message); // Show success message
      fetchAdmins(); // Refresh the admin list after registration
    } catch (error) {
      alert(error.response.data.message || "Registration failed"); // Show error message
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("/api/admins");
      console.log(response);
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

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

  useEffect(() => {
    fetchAdmins(); // Fetch and display the list of admins on component mount
  }, []);

  return (
    <div className="container">
      <h1>Add Admin </h1>
      <form id="registerForm" onSubmit={registerUser}>
        <div className="form-group">
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
        <div className="form-group">
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
          <img
            id="eyeClose"
            src="./eye-close.png"
            alt="Eye Closed"
            aria-label="Show password"
            className="eye-icon"
            onClick={togglePasswordVisibility}
          />
          <img
            id="eyeOpen"
            src="./eye-open.png"
            alt="Eye Open"
            aria-label="Hide password"
            className="eye-icon"
            onClick={togglePasswordVisibility}
            style={{ display: "none" }}
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

      <h1> Admins</h1>
      <ul id="adminList">
        {admins.map((admin, index) => (
          <li key={index}>{admin.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
