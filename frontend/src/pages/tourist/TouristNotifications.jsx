import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TouristNotifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/notifications/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  return (
    <div className="notification-container">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification._id} className="notification">
            <p>{notification.message}</p>
          </div>
        ))
      ) : (
        <p>No notifications</p>
      )}
    </div>
  );
};

export default TouristNotifications;