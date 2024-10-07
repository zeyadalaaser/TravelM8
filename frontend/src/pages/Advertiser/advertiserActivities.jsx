'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Activity, Calendar, DollarSign, Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { useToast } from "./components/useToast";

const tagOptions = ["historic areas", "beaches", "family-friendly", "shopping", "budget-friendly"]

const mockActivities = [
  { _id: '1', title: 'City Tour', description: 'Explore the city', date: '2023-07-15', price: 50, category: 'Tour', isBookingOpen: true, location: 'Downtown', tags: ['historic areas', 'family-friendly'], discount: 10 },
  { _id: '2', title: 'Beach Day', description: 'Relax by the ocean', date: '2023-07-20', price: 75, category: 'Outdoor', isBookingOpen: true, location: 'Sunny Beach', tags: ['beaches', 'family-friendly'], discount: 0 },
  { _id: '3', title: 'Shopping Spree', description: 'Explore local markets', date: '2023-07-25', price: 30, category: 'Shopping', isBookingOpen: false, location: 'City Center', tags: ['shopping', 'budget-friendly'], discount: 15 },
]

const AdvertiserActivities = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentActivity, setCurrentActivity] = useState(null)

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setActivities(mockActivities)
      setLoading(false)
    }, 1000)
  }, [])

  const handleCreateActivity = (newActivity) => {
    const activity = { ...newActivity, _id: Date.now().toString() }
    setActivities([...activities, activity])
    setIsCreateModalOpen(false)
    toast({
      title: "Activity Created",
      description: "Your new activity has been successfully created.",
    })
  }

  const handleUpdateActivity = (updatedActivity) => {
    setActivities(activities.map(a => a._id === updatedActivity._id ? updatedActivity : a))
    setIsEditModalOpen(false)
    toast({
      title: "Activity Updated",
      description: "Your activity has been successfully updated.",
    })
  }

  const handleDeleteActivity = (id) => {
    setActivities(activities.filter(a => a._id !== id))
    toast({
      title: "Activity Deleted",
      description: "Your activity has been successfully deleted.",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Activities</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Activity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activities.length > 0 ? new Date(activities[0].date).toLocaleDateString() : 'N/A'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${activities.reduce((sum, activity) => sum + activity.price, 0)}
            </div>
          </CardContent>
        </Card>
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
                  <TableCell>{activity.location}</TableCell>
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
                        setCurrentActivity(activity)
                        setIsEditModalOpen(true)
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
            {currentActivity && (
              <ActivityForm 
                initialData={currentActivity} 
                onSubmit={(data) => handleUpdateActivity({ ...data, _id: currentActivity._id })} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const ActivityForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    date: '',
    price: 0,
    category: '',
    isBookingOpen: false,
    location: '',
    tags: [],
    discount: 0,
  })

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
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
      </div>
      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map(tag => (
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
        <Input id="discount" name="discount" type="number" value={formData.discount} onChange={handleChange} required />
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

export default AdvertiserActivities;

