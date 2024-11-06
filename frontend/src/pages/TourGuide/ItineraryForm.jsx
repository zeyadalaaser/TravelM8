import React,  { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";  // Adjust path as per your setup
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, MinusCircle } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ItineraryForm = () => {
  const location = useLocation();
  const itinerary = location.state?.itinerary; // Safely access `id` from state
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    activities: [''],
    historicalSites: [''],
    tourLanguage: '',
    price: 0,
    timeline: [{ event: '', startTime: '', endTime: '' }],
    availableSlots: [{ date: '', numberOfBookings: 0 }],
    accessibility: '',
    pickUpLocation: '',
    dropOffLocation: '',
    tags: [''],
    tourGuideId: '',
  });

  useEffect(() => {
    if(itinerary)
      setFormData(itinerary);
  }, []); 

  
    const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  
    const handleArrayInputChange = (index, field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => (i === index ? value : item))
      }))
    }
  
    const handleTimelineChange = (index, key, value) => {
      setFormData(prev => ({
        ...prev,
        timeline: prev.timeline.map((item, i) => (i === index ? { ...item, [key]: value } : item))
      }))
    }
  
    const handleAvailableSlotsChange = (index, key, value) => {
      setFormData(prev => ({
        ...prev,
        availableSlots: prev.availableSlots.map((item, i) => (i === index ? { ...item, [key]: value } : item))
      }))
    }
  
    const addArrayField = (field) => {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], '']
      }))
    }
  
    const removeArrayField = (field, index) => {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }))
    }
  
    const addTimelineEvent = () => {
      setFormData(prev => ({
        ...prev,
        timeline: [...prev.timeline, { event: '', startTime: '', endTime: '' }]
      }))
    }
  
    const removeTimelineEvent = (index) => {
      setFormData(prev => ({
        ...prev,
        timeline: prev.timeline.filter((_, i) => i !== index)
      }))
    }
  
    const addAvailableSlot = () => {
      setFormData(prev => ({
        ...prev,
        availableSlots: [...prev.availableSlots, { date: '', numberOfBookings: 0 }]
      }))
    }
  
    const removeAvailableSlot = (index) => {
      setFormData(prev => ({
        ...prev,
        availableSlots: prev.availableSlots.filter((_, i) => i !== index)
      }))
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      let response;
      try {
        if(itinerary){
           const id = itinerary._id;
           response = await fetch(`http://localhost:5001/api/itineraries/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // convert the data object to JSON
          });
        }
        else{
            response = await fetch('http://localhost:5001/api/itineraries', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // convert the data object to JSON
          });
        }
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const result = await response.json(); // handle the response
        console.log('Success:', result);
      } catch (error) {
        console.error('Error:', error);
      }
      console.log(formData)
    }
  
    const formatDateForInput = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-11
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
    
      return `${year}-${month}-${day}T${hours}:${minutes}`; // Format: yyyy-MM-ddThh:mm
    };
    const formatDateForInput2 = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-11
      const day = String(date.getDate()).padStart(2, '0');
    
      return `${year}-${month}-${day}`;
    };


    return (
      
      <Card className="container w-2/3 min-h-[101vh] overflow-y: scroll mx-auto">
        <CardHeader>
        <Button
          variant="ghost"
          className="absolute left-0 top-0 text-lg font-bold mt-4 ml-4 text-gray-600 hover:text-gray-800"
          onClick={() => navigate("/tourGuideDashboard")}
        >
          Back
        </Button>
          <CardTitle className="text-2xl font-bold text-center">Itinerary Form</CardTitle>
          <CardDescription className="text-center">Enter the details for your itinerary.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tourLanguage">Tour Language</Label>
                <Input
                  id="tourLanguage"
                  name="tourLanguage"
                  value={formData.tourLanguage}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
  
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="min-h-[100px]"
              />
            </div>
  
            <Separator />
  
            <div className="space-y-2">
              <Label>Activities</Label>
              <div className="grid grid-cols-2 gap-4">
                {formData.activities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={activity}
                      onChange={(e) => handleArrayInputChange(index, 'activities', e.target.value)}
                      required
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => removeArrayField('activities', index)}>
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayField('activities')} className="mt-2">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Activity
              </Button>
            </div>
  
            <div className="space-y-2">
              <Label>Historical Sites</Label>
              <div className="grid grid-cols-2 gap-4">
                {formData.historicalSites.map((site, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={site}
                      onChange={(e) => handleArrayInputChange(index, 'historicalSites', e.target.value)}
                      required
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => removeArrayField('historicalSites', index)}>
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayField('historicalSites')} className="mt-2">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Historical Site
              </Button>
            </div>
  
            <Separator />
  
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessibility">Accessibility</Label>
                <Input
                  id="accessibility"
                  name="accessibility"
                  value={formData.accessibility}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickUpLocation">Pick-up Location</Label>
                <Input
                  id="pickUpLocation"
                  name="pickUpLocation"
                  value={formData.pickUpLocation}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropOffLocation">Drop-off Location</Label>
                <Input
                  id="dropOffLocation"
                  name="dropOffLocation"
                  value={formData.dropOffLocation}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
  
            <Separator />
  
            <div className="space-y-2">
              <Label>Timeline</Label>
              <div className="space-y-4">
                {formData.timeline.map((event, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-md bg-secondary">
                    <Input
                      placeholder="Event"
                      value={event.event}
                      onChange={(e) => handleTimelineChange(index, 'event', e.target.value)}
                      required
                    />
                    <Input
                      type="datetime-local"
                      value={formatDateForInput(event.startTime)}
                      onChange={(e) => handleTimelineChange(index, 'startTime', e.target.value)}
                      required
                    />
                    <Input
                      type="datetime-local"
                      value={formatDateForInput(event.endTime)}
                      onChange={(e) => handleTimelineChange(index, 'endTime', e.target.value)}
                      required
                    />
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeTimelineEvent(index)} className="col-span-3">
                      Remove Event
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addTimelineEvent} className="mt-2">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Timeline Event
              </Button>
            </div>
  
            <div className="space-y-2">
              <Label>Available Slots</Label>
              <div className="space-y-4">
                {formData.availableSlots.map((slot, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-md bg-secondary">
                    <Input
                      type="date"
                      value={formatDateForInput2(slot.date)}
                      onChange={(e) => handleAvailableSlotsChange(index, 'date', e.target.value)}
                      required
                    />
                    <Input
                      type="number"
                      value={slot.numberOfBookings}
                      onChange={(e) => handleAvailableSlotsChange(index, 'numberOfBookings', parseInt(e.target.value))}
                      required
                      min="0"
                    />
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeAvailableSlot(index)} className="col-span-2">
                      Remove Slot
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addAvailableSlot} className="mt-2">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Available Slot
              </Button>
            </div>
  
            <Separator />
  
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="grid grid-cols-3 gap-4">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      name='tags'
                      value={tag || ''}
                      onChange={(e) => handleArrayInputChange(index, 'tags', e.target.value)}
                      required
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => removeArrayField('tags', index)}>
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayField('tags')} className="mt-2">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Tag
              </Button>
            </div>
  
            <div className="space-y-2">
              <Label htmlFor="tourGuideId">Tour Guide ID</Label>
              <Input
                id="tourGuideId"
                name="tourGuideId"
                value={formData.tourGuideId || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Submit</Button>
          </CardFooter>
        </form>
      </Card>
    );
  };

export default ItineraryForm;