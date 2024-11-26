"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const ManageActivities = () => {
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/activities2");
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error.message);
    }
  };

  const toggleFlagActivity = async (id, isFlagged) => {
    try {
      const endpoint = isFlagged
        ? `http://localhost:5001/api/activities/${id}/unflag`
        : `http://localhost:5001/api/activities/${id}/flag`;

      const response = await axios.put(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(
        isFlagged
          ? "Activity unflagged successfully!"
          : "Activity flagged successfully!"
      );

      fetchActivities(); // Refresh activities list
    } catch (error) {
      console.error("Error toggling activity flag:", error.message);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Activities</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="p-4 border border-gray-300 rounded-lg shadow-md"
          >
            <h2 className="text-lg font-bold">{activity.title}</h2>
            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
            <p className="text-sm mb-2">
              <strong>Date:</strong> {new Date(activity.date).toLocaleString()}
            </p>
            <p className="text-sm mb-2">
              <strong>Location:</strong> {activity.location.name}
            </p>
            <p className="text-sm mb-4">
              <strong>Price:</strong> $
              {Array.isArray(activity.price)
                ? `${activity.price[0]} - ${activity.price[1]}`
                : activity.price}
            </p>
            <Button
              className="w-full mb-2"
              onClick={() => toggleFlagActivity(activity._id, activity.flagged)}
            >
              {activity.flagged ? "Unflag Activity" : "Flag Activity"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageActivities;
