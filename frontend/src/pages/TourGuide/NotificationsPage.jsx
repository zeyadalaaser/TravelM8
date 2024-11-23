import React, { useEffect, useState } from "react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [isLoading, setIsLoading] = useState(true); // Loading indicator
  const [error, setError] = useState(null); // Error message

  // Fetch notifications from the backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token"); // Fetch token from local storage
        if (!token) {
          setError("User not logged in. Please log in to view notifications.");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5001/api/notifications", // Replace with your actual API endpoint
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the token in Authorization header
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setNotifications(data.notifications || []); // Assuming backend sends { notifications: [] }
        setError(null);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Notifications</h1>

      {isLoading ? (
        <p>Loading notifications...</p>
      ) : error ? (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      ) : notifications.length === 0 ? (
        <p style={{ textAlign: "center" }}>No notifications found.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: "0" }}>
          {notifications.map((notification) => (
            <li
              key={notification._id}
              style={{
                marginBottom: "20px",
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "5px",
              }}
            >
              <p>{notification.message}</p>
              <p style={{ fontSize: "12px", color: "gray" }}>
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
