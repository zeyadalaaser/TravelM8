"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/NavbarAdmin";
import axios from "axios";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const ManageActivities = () => {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Added state for search term

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

      await axios.put(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast(
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-8 w-4/5">
        <h1 className="text-3xl font-bold mb-8">Manage Activities</h1>
        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Search by activity title" // Placeholder text
            className="w-1/3 border border-gray-300 rounded-md p-2" // Adjusted width and styling
            onChange={handleSearchChange} // Added onChange handler
            value={searchTerm} // Bind search term to input
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredActivities.map((activity) => (
            <div
              key={activity._id}
              className="border border-gray-300 rounded-lg shadow-md flex flex-col overflow-hidden" // Added overflow-hidden for image
            >
              <img 
                src={activity.image} // Assuming activity has an imageUrl property
                alt={activity.title}
                className="w-full h-48 object-cover" // Adjusted image size
              />
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-bold">{activity.title}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  {activity.description}
                </p>
                <p className="text-sm mb-2">
                  <strong>Date:</strong>{" "}
                  {new Date(activity.date).toLocaleString()}
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
                  className="w-full mb-2 mt-auto"
                  onClick={() =>
                    toggleFlagActivity(activity._id, activity.flagged)
                  }
                >
                  {activity.flagged ? "Unflag Activity" : "Flag Activity"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManageActivities;