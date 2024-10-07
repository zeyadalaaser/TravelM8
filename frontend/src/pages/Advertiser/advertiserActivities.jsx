import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Activity, Calendar, DollarSign, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useToast } from "./components/useToast";
import { useNavigate } from 'react-router-dom';
import useRouter from "@/hooks/useRouter";

export default function AdvertiserActivities() {
  const token = localStorage.getItem('token');
  const navigate2 = useRouter();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);

  useEffect(() => {
    // Redirect if no token is found
    if (!token) navigate2("/login");
  }, [token]);

  const fetchActivities = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/activities', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setActivities(data);
      } else {
        throw new Error("Received data is not an array");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast({ title: "Error", description: "Failed to fetch activities." });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [token]);

  const handleCreateActivity = async (activityData) => {
    try {
        const response = await fetch(`http://localhost:5001/api/activities/myActivities`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(activityData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create activity');
        }

        // Handle success (e.g., refresh activity list)
        await fetchActivities();
    } catch (error) {
        console.error("Error creating activity:", error); // Improved logging
        toast({ title: "Error", description: error.message });
    }
};


const handleUpdateActivity = async (updatedData) => {
  setLoading(true);
  try {
    const response = await fetch(`http://localhost:5001/api/activities/${updatedData._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ensure to include the token here
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const data = await response.json(); // Parse response to get error message
      throw new Error(data.message || 'Failed to update activity');
    }

    // Fetch activities again after updating
    await fetchActivities();
    setIsEditModalOpen(false);
    toast({ title: "Activity Updated", description: "Your activity has been successfully updated." });
  } catch (error) {
    console.error("Error updating activity:", error);
    toast({ title: "Error", description: "Failed to update activity. Please try again." });
  } finally {
    setLoading(false);
  }
};


  const handleDeleteActivity = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/activities/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json(); // Get the error message from the response
        throw new Error(data.message || 'Failed to delete activity');
      }

      // Fetch activities again after deletion
      await fetchActivities();
      toast({ title: "Activity Deleted", description: "Your activity has been successfully deleted." });
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast({ title: "Error", description: "Failed to delete activity." });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Activities</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Activity
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Activities</CardTitle>
          <p className="text-sm text-muted-foreground">Manage your created activities here.</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity._id}>
                  <TableCell className="font-medium">{activity.title}</TableCell>
                  <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                  <TableCell>${activity.price}</TableCell>
                  <TableCell>{activity.location && (
                    <>
                      <p>Latitude: {activity.location.lat}</p>
                      <p>Longitude: {activity.location.lng}</p>
                    </>
                  )}</TableCell>
                  <TableCell>{activity.category}</TableCell>
                  <TableCell>{activity.tags.join(', ')}</TableCell>
                  <TableCell>{activity.discount}%</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${activity.isBookingOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {activity.isBookingOpen ? "Open" : "Closed"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setCurrentActivity(activity);
                        setIsEditModalOpen(true);
                      }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteActivity(activity._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Create New Activity</DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-6">
            <ActivityForm onSubmit={handleCreateActivity} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
  <DialogContent className="max-w-md w-full">
    <DialogHeader>
      <DialogTitle>Edit Activity</DialogTitle>
    </DialogHeader>
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-6">
      {currentActivity && <ActivityForm initialData={currentActivity} onSubmit={handleUpdateActivity} />}
    </div>
  </DialogContent>
</Dialog>
    </div>
  );
}

// Add your ActivityForm component here
const ActivityForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: initialData ? initialData._id : '', // Initialize id correctly
    title: initialData ? initialData.title : '',
    description: initialData ? initialData.description : '',
    date: initialData ? initialData.date : '',
    price: initialData ? initialData.price : 0,
    category: initialData ? initialData.category : '',
    isBookingOpen: initialData ? initialData.isBookingOpen : false,
    location: {
      lat: initialData ? initialData.location.lat : 0,
      lng: initialData ? initialData.location.lng : 0,
    },
    tags: initialData ? initialData.tags : [],
    discount: initialData ? initialData.discount : 0,
  });

  // Update formData when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData._id, // Correctly set the ID
        title: initialData.title,
        description: initialData.description,
        date: initialData.date,
        price: initialData.price,
        category: initialData.category,
        isBookingOpen: initialData.isBookingOpen,
        location: { lat: initialData.location.lat, lng: initialData.location.lng },
        tags: initialData.tags,
        discount: initialData.discount,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTagChange = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange}  />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" value={formData.description} onChange={handleChange}  />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange}  />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange}  />
      </div>
      <div>
        <Label htmlFor="location">Location lat</Label>
        <Input id="location" name="location" value={formData.location.lat} onChange={handleChange}  />
      </div>
      <div>
        <Label htmlFor="location">Location lng</Label>
        <Input id="location" name="location" value={formData.location.lng} onChange={handleChange}  />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" value={formData.category} onChange={handleChange}  />
      </div>
      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map(tag => (
            <label key={tag} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.tags.includes(tag)}
                onChange={() => handleTagChange(tag)}
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="discount">Discount (%)</Label>
        <Input id="discount" name="discount" type="number" value={formData.discount} onChange={handleChange}  />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isBookingOpen"
          name="isBookingOpen"
          checked={formData.isBookingOpen}
          onChange={(e) => setFormData(prev => ({ ...prev, isBookingOpen: e.target.checked }))}
        />
        <Label htmlFor="isBookingOpen">Open for Booking</Label>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
