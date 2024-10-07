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

export default function AdvertiserProfile() {
  const [advertiser, setAdvertiser] = useState({
    name: "John Doe",
    description: "Experienced advertiser with a passion for creative activities",
    username: "johndoe",
    email: "john.doe@example.com",
    website: "www.johndoe-advertising.com",
    hotline: 19633,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false); // Loading state

  const handleUpdateAdvertiser = async (updatedData) => {
    setLoading(true); // Set loading state
    console.log("Attempting to update with data:", updatedData);
    try {
      const response = await fetch(`/api/advertiser/${advertiser.username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedAdvertiser = await response.json();
      console.log("Received updated advertiser:", updatedAdvertiser);
      setAdvertiser(updatedAdvertiser);
      setIsEditModalOpen(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Custom Progress Bar Component
  const CustomProgressBar = ({ value }) => {
    const progressBarStyle = {
      width: '100%',
      backgroundColor: '#e0e0e0',
      borderRadius: '4px',
      height: '8px',
    };

    const progressFillStyle = {
      width: `${value}%`,
      backgroundColor: '#3b82f6',
      height: '100%',
      borderRadius: '4px',
    };

    return (
      <div style={progressBarStyle}>
        <div style={progressFillStyle} />
      </div>
    );
  };

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
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Advertiser" />
                <AvatarFallback>{advertiser.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4 text-2xl">{advertiser.name}</CardTitle>
              <p className="text-muted-foreground">Company Details</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{advertiser.email}</p>
              <p className="text-muted-foreground">Member since: Jan 2023</p>
              <p className="text-muted-foreground">{advertiser.website}</p>
              <p className="text-muted-foreground">{advertiser.hotline}</p>
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <EditProfileForm advertiser={advertiser} onSubmit={handleUpdateAdvertiser} />
            </DialogContent>
          </Dialog>
        </CardContent>
          </Card>
          <div className="col-span-1 md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-4">
                  <DollarSign className="h-10 w-10 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spend</p>
                    <p className="text-2xl font-bold">$12,345</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Users className="h-10 w-10 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Impressions</p>
                    <p className="text-2xl font-bold">1.2K</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <TrendingUp className="h-10 w-10 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Recognition</p>
                    <p className="text-2xl font-bold">15,678</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <BarChart className="h-10 w-10 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Activity</p>
                    <p className="text-2xl font-bold">87%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Summer Sale", progress: 75 },
                    { name: "New Product Launch", progress: 40 },
                    { name: "Brand Awareness", progress: 60 },
                  ].map((activity) => (
                    <div key={activity.name} className="space-y-2">
                      <div className="flex justify-between">
                        <p>{activity.name}</p>
                        <p>{activity.progress}%</p>
                      </div>
                      <CustomProgressBar value={activity.progress} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                "Created a new campaign 'Back to School'",
                "Updated budget for 'Summer Sale' campaign",
                "Achieved 1000 conversions milestone",
                "Added new targeting options to 'Brand Awareness' campaign",
              ].map((activity, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  <p>{activity}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EditProfileForm({ advertiser, onSubmit, loading }) {
  const [formData, setFormData] = useState(advertiser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={loading} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required disabled={loading} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={loading} />
      </div>
      <div>
        <Label htmlFor="website">Website</Label>
        <Input id="website" name="website" value={formData.website} onChange={handleChange} disabled={loading} />
      </div>
      <div>
        <Label htmlFor="hotline">Hotline</Label>
        <Input id="hotline" name="hotline" type="number" value={formData.hotline} onChange={handleChange} disabled={loading} />
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Profile"}</Button>
    </form>
  );
}
