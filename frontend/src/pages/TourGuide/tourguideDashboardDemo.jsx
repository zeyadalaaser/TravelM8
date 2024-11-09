import React, { useState, useEffect } from 'react';
import { Bell, Calendar, ChevronDown, DollarSign, Layout, List, Map, Plus, Settings, Tag, User, Users, PlusCircle, MinusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from "react-router-dom";
import * as services from "@/pages/TourGuide/api/apiService.js"
import { Badge } from "@/components/ui/badge"


const TourGuideDashboard = () => {
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
  });
  const [itinerary, setItinerary] = useState(null);
  const token = localStorage.getItem('token');
  const [combinedArray, setCombinedArray] = useState([]);
  const [activities, setActivities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    if(itinerary)
      setFormData(itinerary);
  }, []); 


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
  const addField = (field) => {
    if (field === 'timeline') {
      setFormData({
        ...formData,
        [field]: [...formData[field], { event: '', startTime: '', endTime: '' }]
      });
    } else if (field === 'availableSlots') {
      setFormData({
        ...formData,
        [field]: [...formData[field], { date: '', numberOfBookings: 0 }]
      });
    } else {
      setFormData({ ...formData, [field]: [...formData[field], ''] });
    }
  };

  const removeField = (field, index) => {
    const updatedData = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedData });
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`; // Format: yyyy-MM-ddThh:mm
  };
  const handleSelectChange = (value, field) => {
    const isSelected = selectedActivities.includes(value);
    setFormData({ ...formData, [field]: isSelected ? selectedActivities.filter(item => item !== value) : [...selectedActivities, value] });
    setSelectedActivities((prevItems) => {
      if (isSelected) {
        return prevItems.filter((item) => item !== value);
      } else {
        return [...prevItems, value];
      }
    });
  };

  const handleSelectPlacesChange = (value, field) => {
    const isSelected = selectedPlaces.includes(value);
    setFormData({ ...formData, [field]: isSelected ? selectedPlaces.filter(item => item !== value) : [...selectedPlaces, value] });
    setSelectedPlaces((prevItems) => {
      if (isSelected) {
        return prevItems.filter((item) => item !== value);
      } else {
        return [...prevItems, value];
      }
    });
  };

  const handleSelectTagChange = (value, field) => {
    setSelectedTags((prevItems) => {
      const isSelected = prevItems.includes(value);
  
      // Update selectedTags state: add or remove the value
      const updatedTags = isSelected
        ? prevItems.filter((item) => item !== value)
        : [...prevItems, value];
  
      // Update formData with updated tags
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: updatedTags, // Update the formData with the new tags array
      }));
  
      return updatedTags; // Return the updated tags to update selectedTags state
    });
  };

  const handleRemoveActivityBadge = (activity) => {
    setSelectedActivities((prevItems) =>
      prevItems.filter((item) => item !== activity)
    );
    setFormData((prevData) => ({
      ...prevData,
      activities: prevData.activities.filter((item) => item !== activity),
    }));
  };
  
  const handleRemoveTagBadge = (tag) => {
    setSelectedTags((prevItems) =>
      prevItems.filter((item) => item !== tag)
    );
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((item) => item !== tag),
    }));
  };

  const handleRemovePlaceBadge = (place) => {
    setSelectedPlaces((prevItems) =>
      prevItems.filter((item) => item !== place)
    );
    setFormData((prevData) => ({
      ...prevData,
      historicalSites: prevData.tags.filter((item) => item !== place),
    }));
  };

  const formatDateForInput2 = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-11
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  const fetchTags = async () => {
    const tags = await services.getTags();
  //     const allTags = [...tags]
    setCombinedArray(tags);
    console.log(combinedArray);
  }
  useEffect(() => {
  fetchTags();
  }, []);

  const fetchActivities = async () => {
        const activities = await services.getActivities();
        const allActivities = [...activities].map(activity => activity.title);
        setActivities(allActivities);
    }
    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchPlaces = async () => {
        const places = await services.getAllPlaces();
        const allPlaces = [...places].map(place => place.name);
        setPlaces(allPlaces);
    }
    useEffect(() => {
        fetchPlaces();
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(formData);
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
          try{
            response = await services.addItinerary(token, formData);
            alert('Itinerary Added Successfully');
            console.log('Itinerary Added Successfully');
            setDialogOpen(false); 
          }
          catch (error) {
            console.log('Error:', error.message);
          }
        }
      } catch (error) {
        console.log('Error:', error.message);
      }
      console.log(formData)
    }
    
    
    useEffect(() => {
      if (!token) {
        navigate("/login");
        return;
      }
      fetchItineraries();
    }, [navigate, token]);
    
    async function fetchItineraries() {
      try {
        const response = await services.getMyItineraries(token);
        setItineraries(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    }; 




  // const [itineraries, setItineraries] = useState([
  //   {
  //     id: 1,
  //     name: "Historical City Tour",
  //     description: "Explore the rich history of our city",
  //     duration: "4 hours",
  //     language: "English",
  //     price: "$50",
  //     locations: ["Old Town Square", "Castle", "Cathedral"],
  //     isActive: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Nature Hike Adventure",
  //     description: "Experience the beautiful landscapes around the city",
  //     duration: "6 hours",
  //     language: "English, Spanish",
  //     price: "$75",
  //     locations: ["City Park", "Mountain Trail", "Scenic Viewpoint"],
  //     isActive: false,
  //   },
  // ]);


  const [salesData] = useState([
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 7000 },
  ]);

  const [notifications] = useState([
    { id: 1, message: "Your 'City Night Tour' has been flagged as inappropriate. Please review." },
    { id: 2, message: "New booking for 'Historical City Tour' on June 15th." },
  ]);



  const toggleItineraryStatus = (id) => {
    setItineraries(itineraries.map(itinerary => 
      itinerary._id === id ? { ...itinerary, isBookingOpen: !itinerary.isBookingOpen } : itinerary
    ));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
       <aside className="w-64 bg-white shadow-md">
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-800">Tour Guide Dashboard</h2>
          </div>
          <nav className="mt-6">
            <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 w-full text-left">
              <Layout className="mr-3" />
              Dashboard
            </button>
            <button className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left">
              <Map className="mr-3" />
              Itineraries
            </button>
            <button className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left">
              <DollarSign className="mr-3" />
              Sales Reports
            </button>
            <button className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left">
              <Users className="mr-3" />
              Tourist Reports
            </button>
            <button className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left">
              <Bell className="mr-3" />
              Notifications
            </button>
            <button className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left">
              <Settings className="mr-3" />
              Settings
            </button>
          </nav>
        </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Tour Guide Dashboard</h1>
            <div className="flex items-center">
              <Button variant="outline" size="icon" className="mr-4">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>
              <div className="flex items-center">
                <img
                  className="w-8 h-8 rounded-full mr-2"
                  src="/placeholder.svg?height=32&width=32"
                  alt="User avatar"
                />
                <span className="text-gray-700 mr-2">Jane Doe</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Itineraries</CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{itineraries.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Itineraries</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {itineraries.filter(i => i.isBookingOpen).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$24,500</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tourists</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="itineraries" className="space-y-4">
            <TabsList>
              <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
              <TabsTrigger value="sales">Sales Report</TabsTrigger>
              <TabsTrigger value="tourists">Tourist Report</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="itineraries" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Itineraries</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button><Plus className="mr-2 h-4 w-4" /> Create Itinerary</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Tour</DialogTitle>
                  </DialogHeader>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label>Activities</Label>
                      <Select
                          name="activities"
                          value={formData.activities}
                          onValueChange={(value) => handleSelectChange(value, "activities")}
                          multiple
                      >
                              <SelectTrigger>
                              <SelectValue placeholder="Select activities" />
                              </SelectTrigger>
                              <SelectContent>
                              {activities.map((activity) => (
                                  <SelectItem key={activity} value={activity}>
                                  {activity}
                                  </SelectItem>
                              ))}
                              </SelectContent>
                          </Select>
                <div style={{ marginTop: "10px" }} className="badge-container">
                  {selectedActivities.map((activity, index) => (
                    <Badge key={index} style={{ marginRight:"5px" }}  className="badge">
                      {activity}
                      <button
                        onClick={() => handleRemoveActivityBadge(activity)}
                        style={{
                          marginLeft: "5px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        &times;
                      </button>
                    </Badge>
                  ))}
                </div>
                    </div>

                    <div>
                      <Label>Historical Sites</Label>
                      <Select
                          name="historicalSites"
                          value={formData.historicalSites}
                          onValueChange={(value) => handleSelectPlacesChange(value, "historicalSites")}
                          multiple>
                              <SelectTrigger>
                              <SelectValue placeholder="Select historical sites" />
                              </SelectTrigger>
                              <SelectContent>
                              {places.map((place) => (
                                  <SelectItem key={place} value={place}>
                                  {place}
                                  </SelectItem>
                              ))}
                              </SelectContent>
                          </Select>
                <div style={{ marginTop: "10px" }} className="badge-container">
                  {selectedPlaces.map((place, index) => (
                    <Badge key={index} style={{ marginRight:"5px" }}  className="badge">
                      {place}
                      <button
                        onClick={() => handleRemovePlaceBadge(place)}
                        style={{
                          marginLeft: "5px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        &times;
                      </button>
                    </Badge>
                  ))}
                </div>
                    </div>

                    <div>
                      <Label htmlFor="tourLanguage">Tour Language</Label>
                      <Select name="tourLanguage" value={formData.tourLanguage} onValueChange={(value) => setFormData({ ...formData, tourLanguage: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          {/* Add more languages as needed */}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label>Timeline</Label>
                      {formData.timeline.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-2">
                          <Input
                            value={item.event}
                            onChange={(e) => handleTimelineChange(index, 'event', e.target.value)}
                            placeholder="Event"
                          />
                          <Input
                            type="datetime-local"
                            value={formatDateForInput(item.startTime)}
                            onChange={(e) => handleTimelineChange(index, 'startTime', e.target.value)}
                          />
                          <Input
                            type="datetime-local"
                            value={formatDateForInput(item.endTime)}
                            onChange={(e) => handleTimelineChange(index, 'endTime', e.target.value)}
                          />
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeField('timeline', index)}>
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => addField('timeline')} className="mt-2">
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Timeline Event
                      </Button>
                    </div>
                    <div>
                      <Label>Available Slots</Label>
                      {formData.availableSlots.map((slot, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-2">
                          <Input
                            type="date" 
                            value={formatDateForInput2(slot.date)}
                            onChange={(e) => handleAvailableSlotsChange(index, 'date', e.target.value)}
                          />
                          <Input
                            type="number"
                            value={slot.numberOfBookings}
                            onChange={(e) => handleAvailableSlotsChange(index, 'numberOfBookings', parseInt(e.target.value))}
                            placeholder="Number of Bookings"
                          />
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeField('availableSlots', index)}>
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => addField('availableSlots')} className="mt-2">
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Available Slot
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="accessibility">Accessibility</Label>
                      <Select name="accessibility" value={formData.accessibility} onValueChange={(value) => setFormData({ ...formData, accessibility: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select accessibility level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="challenging">Challenging</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pickUpLocation">Pick Up Location</Label>
                      <Input id="pickUpLocation" name="pickUpLocation" value={formData.pickUpLocation} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="dropOffLocation">Drop Off Location</Label>
                      <Input id="dropOffLocation" name="dropOffLocation" value={formData.dropOffLocation} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label>Tags</Label>
                      <Select
                          name="tags"
                          value={formData.tags}
                          onValueChange={(value) => handleSelectTagChange(value, "tags")}
                          multiple
                      >
                              <SelectTrigger>
                              <SelectValue placeholder="Select tags" />
                              </SelectTrigger>
                              <SelectContent>
                              {combinedArray.map((tag) => (
                                  <SelectItem key={tag._id} value={tag}>
                                  {tag.name}
                                  </SelectItem>
                              ))}
                              </SelectContent>
                          </Select>
                          <div style={{ marginTop: "10px" , marginRight:"50px" }} className="badge-container">
                              {selectedTags.map((tag, index) => (
                              <Badge key={index} style={{ marginRight:"5px" }} className="badge">
                                  {tag.name}
                                  <button
                                  onClick={() => handleRemoveTagBadge(tag)}
                                  style={{
                                      marginLeft: "5px",
                                      background: "transparent",
                                      border: "none",
                                      cursor: "pointer",
                                      fontSize: "14px",
                                  }}
                                  >
                                  &times;
                                  </button>
                              </Badge>
                              ))}
                          </div>
                              </div>
                              <DialogFooter className="sm:justify-start">
                                 <Button  onClick={handleSubmit} className="w-full">Submit</Button>
                              </DialogFooter>
                          </DialogContent>
                      </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itineraries.map((itinerary) => (
                  <Card className="mb-6" key={itinerary._id}>
                    <CardHeader>
                    {/* <img src={location.image} alt={location.name} className="w-full h-48 object-cover rounded-t-lg" /> */}
                      <CardTitle>{itinerary.name}</CardTitle>
                      <CardDescription>{itinerary.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p><strong>Accessbilty:</strong> {itinerary.accessibility}</p>
                      <p><strong>Language:</strong> {itinerary.tourLanguage}</p>
                      <p><strong>Pickup Location:</strong> {itinerary.pickUpLocation}</p>
                      <p><strong>Dropoff Location:</strong> {itinerary.dropOffLocation}</p>
                      <p><strong>Price:</strong> {itinerary.price}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button  variant="outline"> Edit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Tour</DialogTitle>
                  </DialogHeader>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label>Activities</Label>
                      <Select
                          name="activities"
                          value={formData.activities}
                          onValueChange={(value) => handleSelectChange(value, "activities")}
                          multiple
                      >
                              <SelectTrigger>
                              <SelectValue placeholder="Select activities" />
                              </SelectTrigger>
                              <SelectContent>
                              {activities.map((activity) => (
                                  <SelectItem key={activity} value={activity}>
                                  {activity}
                                  </SelectItem>
                              ))}
                              </SelectContent>
                          </Select>
                <div style={{ marginTop: "10px" }} className="badge-container">
                  {selectedActivities.map((activity, index) => (
                    <Badge key={index} style={{ marginRight:"5px" }}  className="badge">
                      {activity}
                      <button
                        onClick={() => handleRemoveActivityBadge(activity)}
                        style={{
                          marginLeft: "5px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        &times;
                      </button>
                    </Badge>
                  ))}
                </div>
                    </div>

                    <div>
                      <Label>Historical Sites</Label>
                      <Select
                          name="historicalSites"
                          value={formData.historicalSites}
                          onValueChange={(value) => handleSelectPlacesChange(value, "historicalSites")}
                          multiple>
                              <SelectTrigger>
                              <SelectValue placeholder="Select historical sites" />
                              </SelectTrigger>
                              <SelectContent>
                              {places.map((place) => (
                                  <SelectItem key={place} value={place}>
                                  {place}
                                  </SelectItem>
                              ))}
                              </SelectContent>
                          </Select>
                <div style={{ marginTop: "10px" }} className="badge-container">
                  {selectedPlaces.map((place, index) => (
                    <Badge key={index} style={{ marginRight:"5px" }}  className="badge">
                      {place}
                      <button
                        onClick={() => handleRemovePlaceBadge(place)}
                        style={{
                          marginLeft: "5px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        &times;
                      </button>
                    </Badge>
                  ))}
                </div>
                    </div>

                    <div>
                      <Label htmlFor="tourLanguage">Tour Language</Label>
                      <Select name="tourLanguage" value={formData.tourLanguage} onValueChange={(value) => setFormData({ ...formData, tourLanguage: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          {/* Add more languages as needed */}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label>Timeline</Label>
                      {formData.timeline.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-2">
                          <Input
                            value={item.event}
                            onChange={(e) => handleTimelineChange(index, 'event', e.target.value)}
                            placeholder="Event"
                          />
                          <Input
                            type="datetime-local"
                            value={formatDateForInput(item.startTime)}
                            onChange={(e) => handleTimelineChange(index, 'startTime', e.target.value)}
                          />
                          <Input
                            type="datetime-local"
                            value={formatDateForInput(item.endTime)}
                            onChange={(e) => handleTimelineChange(index, 'endTime', e.target.value)}
                          />
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeField('timeline', index)}>
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => addField('timeline')} className="mt-2">
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Timeline Event
                      </Button>
                    </div>
                    <div>
                      <Label>Available Slots</Label>
                      {formData.availableSlots.map((slot, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-2">
                          <Input
                            type="date" 
                            value={formatDateForInput2(slot.date)}
                            onChange={(e) => handleAvailableSlotsChange(index, 'date', e.target.value)}
                          />
                          <Input
                            type="number"
                            value={slot.numberOfBookings}
                            onChange={(e) => handleAvailableSlotsChange(index, 'numberOfBookings', parseInt(e.target.value))}
                            placeholder="Number of Bookings"
                          />
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeField('availableSlots', index)}>
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => addField('availableSlots')} className="mt-2">
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Available Slot
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="accessibility">Accessibility</Label>
                      <Select name="accessibility" value={formData.accessibility} onValueChange={(value) => setFormData({ ...formData, accessibility: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select accessibility level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="challenging">Challenging</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pickUpLocation">Pick Up Location</Label>
                      <Input id="pickUpLocation" name="pickUpLocation" value={formData.pickUpLocation} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="dropOffLocation">Drop Off Location</Label>
                      <Input id="dropOffLocation" name="dropOffLocation" value={formData.dropOffLocation} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label>Tags</Label>
                      <Select
                          name="tags"
                          value={formData.tags}
                          onValueChange={(value) => handleSelectTagChange(value, "tags")}
                          multiple
                      >
                              <SelectTrigger>
                              <SelectValue placeholder="Select tags" />
                              </SelectTrigger>
                              <SelectContent>
                              {combinedArray.map((tag) => (
                                  <SelectItem key={tag._id} value={tag}>
                                  {tag.name}
                                  </SelectItem>
                              ))}
                              </SelectContent>
                          </Select>
                          <div style={{ marginTop: "10px" , marginRight:"50px" }} className="badge-container">
                              {selectedTags.map((tag, index) => (
                              <Badge key={index} style={{ marginRight:"5px" }} className="badge">
                                  {tag.name}
                                  <button
                                  onClick={() => handleRemoveTagBadge(tag)}
                                  style={{
                                      marginLeft: "5px",
                                      background: "transparent",
                                      border: "none",
                                      cursor: "pointer",
                                      fontSize: "14px",
                                  }}
                                  >
                                  &times;
                                  </button>
                              </Badge>
                              ))}
                          </div>
                              </div>
                              <DialogFooter className="sm:justify-start">
                                 <Button  onClick={handleSubmit} className="w-full">Submit</Button>
                              </DialogFooter>
                          </DialogContent>
                      </Dialog>




                      {/* <Button variant="outline" 
                        onClick={handleSubmit}
                      >
                        Edit
                        

                      </Button> */}
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={itinerary.isBookingOpen}
                          onCheckedChange={() => toggleItineraryStatus(itinerary._id)}
                        />
                        <Label>{itinerary.isBookingOpen ? "Active" : "Inactive"}</Label>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="sales" className="space-y-4">
              <h2 className="text-2xl font-bold">Sales Report</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                <CardTitle>Filter Sales Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Itinerary" />
                      </SelectTrigger>
                      <SelectContent>
                        {itineraries.map((itinerary) => (
                          <SelectItem key={itinerary._id} value={itinerary._id.toString()}>
                            {itinerary.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input type="date" className="w-[180px]" />
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">January</SelectItem>
                        <SelectItem value="2">February</SelectItem>
                        <SelectItem value="3">March</SelectItem>
                        {/* Add more months */}
                      </SelectContent>
                    </Select>
                    <Button>Apply Filter</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tourists" className="space-y-4">
              <h2 className="text-2xl font-bold">Tourist Report</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Total Tourists per Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Filter Tourist Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Itinerary" />
                      </SelectTrigger>
                      <SelectContent>
                        {itineraries.map((itinerary) => (
                          <SelectItem key={itinerary._id} value={itinerary._id.toString()}>
                            {itinerary.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">January</SelectItem>
                        <SelectItem value="2">February</SelectItem>
                        <SelectItem value="3">March</SelectItem>
                        {/* Add more months */}
                      </SelectContent>
                    </Select>
                    <Button>Apply Filter</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <h2 className="text-2xl font-bold">Notifications</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications.map((notification) => (
                    <div key={notification.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
                      <p>{notification.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default TourGuideDashboard;