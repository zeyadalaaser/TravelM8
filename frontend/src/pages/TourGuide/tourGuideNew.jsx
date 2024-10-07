"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { BarChart, DollarSign, Users, TrendingUp, Bell, Settings, LogOut } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "./components/useToast";
import { useEffect } from "react";
import useRouter from "@/hooks/useRouter"

import axios from "axios";

export default function tourguideProfile() {
  const token = localStorage.getItem('token');

  const navigate = useRouter();

  useEffect(() => {
    // Redirect if no token is found
    if (!token)
      navigate("/login");
  }, [token]); // Include token in dependency array



  const [tourguide, setTourguide] = useState(null); // Initialize state as null
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);


  const fetchProfileInfo = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/tourguides/myProfile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Parse JSON data
      settourguide(data); // Update state with the fetched profile data

    } catch (error) {
      console.error('Error fetching profile info:', error);

    }
  };


  useEffect(() => {
    if (token) {
      fetchProfileInfo(); // Fetch profile info whenever the token is available
    }
  }, [token]);

  // Custom Progress Bar Component


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="col-span-1">
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="tourguide" />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <p className="text-muted-foreground">username: {tourguide ? tourguide.username : 'null'}</p>
              <p className="text-muted-foreground">name: {tourguide ? tourguide.name : '-'}</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">email: {tourguide ? tourguide.email : 'null'}</p>
              <p className="text-muted-foreground">mobileNumber: {tourguide ? tourguide.description : '-'}</p>
              <p className="text-muted-foreground">yearsOfExperience: {tourguide ? tourguide.mobileNumber : '-'}</p>
              <p className="text-muted-foreground">Previous Work: {tourguide ? tourguide.previousWork : '-'}</p>
              <p className="text-muted-foreground">Languages: {tourguide ? tourguide.languages : '-'}</p>

              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <EditProfileForm tourguide={tourguide} handleSubmit={handleSubmit} loading={loading} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
  async function handleSubmit(changedFields) {
    if (Object.keys(changedFields).length === 0) {
      console.log("No fields were changed");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/tourguides/updateMyProfile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changedFields), // Correctly send the changed fields
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Profile updated successfully', result);
      fetchProfileInfo();

    } catch (error) {

      console.error('Error updating profile', error);
      toast({ title: "Error updating profile", description: error.message });

    } finally {
      setLoading(false);
    }
  }

}

function EditProfileForm({ tourguide, handleSubmit, loading }) {

  const [formData, setFormData] = useState(tourguide || { name: '', description: '', email: '', website: '', hotline: '' });
  const [changedFields, setChangedFields] = useState({}); // To track the changed fields

  useEffect(() => {
    setFormData(tourguide);
  }, [tourguide]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Track which fields were changed
    if (tourguide[name] !== value) {
      setChangedFields((prev) => ({ ...prev, [name]: value }));
    } else {
      // If the value is reset to the original, remove it from the changedFields
      const { [name]: removed, ...rest } = changedFields;
      setChangedFields(rest);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    handleSubmit(changedFields);
  };


  return (
    <form onSubmit={handleSubmitForm} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="mobileNumber">Mobile Number</Label>
        <Textarea
          id="mobileNumber"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="yearsOfExperience">Years of Experience</Label>
        <Input
          id="yearsOfExperience"
          name="yearsOfExperience"
          value={formData.yearsOfExperience}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="previousWork">Previous Work</Label>
        <Input
          id="previousWork"
          name="previousWork"
          type="text"
          value={formData.hotline}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
}
