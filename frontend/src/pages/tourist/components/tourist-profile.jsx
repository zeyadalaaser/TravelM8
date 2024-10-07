"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, DollarSign, Users, TrendingUp, Bell, Settings, LogOut, Home } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import useRouter from "@/hooks/useRouter"

import axios from "axios";
import { useToast } from "../../Advertiser/components/useToast";

export default function TouristProfile() {
  const token = localStorage.getItem('token');

  const { navigate } = useRouter();

  useEffect(() => {
    // Redirect if no token is found
    if (!token)
      navigate("/login");
  }, [token]); // Include token in dependency array



  const [tourist, setTourist] = useState(null); // Initialize state as null
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);


  const fetchProfileInfo = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/tourists/myProfile', {
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
      setTourist(data); // Update state with the fetched profile data

    } catch (error) {
      console.error('Error fetching profile info:', error);

    }
  };


  useEffect(() => {
    if (token) {
      fetchProfileInfo(); // Fetch profile info whenever the token is available
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div className="w-[207px]" />
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/tourist-page')} variant="ghost" size="icon">
              <Home className="h-5 w-5" />
            </Button>
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

        <div className="flex flex-col w-full h-full items-center">
          <Card className="w-[500px]">
            <CardHeader className="flex flex-col items-center">
            <h1 className="text-3xl font-bold">Your Profile</h1>
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Tourist" />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <p className="text-muted-foreground">username: {tourist ? tourist.username : 'null'}</p>
              <p className="text-muted-foreground">name: {tourist ? tourist.name : '-'}</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">email: {tourist ? tourist.email : 'null'}</p>
              <p className="text-muted-foreground">wallet: ${tourist ? tourist.wallet : '0'}</p>
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <EditProfileForm advertiser={tourist} handleSubmit={handleSubmit} loading={loading} />
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
      const response = await fetch('http://localhost:5001/api/tourists/updateMyProfile', {
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

function EditProfileForm({ advertiser, handleSubmit, loading }) {

  const [formData, setFormData] = useState(advertiser ||
    { name: '', email: '' });
  const [changedFields, setChangedFields] = useState({}); // To track the changed fields

  useEffect(() => {
    setFormData(advertiser);
  }, [advertiser]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Track which fields were changed
    if (advertiser[name] !== value) {
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
      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
}
