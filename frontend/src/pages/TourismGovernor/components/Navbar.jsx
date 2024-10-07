// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import a CSS file for styles

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Home</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/add">Add Historical Place</Link>
        </li>
        <li>
          <Link to="/TourismGovernorDashboard">Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
