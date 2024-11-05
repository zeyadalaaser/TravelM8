import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import MapCard from "../../components/Map/MapCard";
import FeedbackAlert from "../../components/FeedbackAlert/FeedbackAlert";

const ActivityForm = () => {
  const loc = useLocation();
  const activity = loc.state?.activity; // Safely access `id` from state
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [latlng, setLatLng] = useState({name:"", lat:0, lng:0});
  const [priceType, setPriceType] = useState("single");
  const [submissionResponse, setSubmissionResponse] = useState({text:"",isSuccess:false,title:""});
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: { lat: latlng.lat, lng: latlng.lng },
    price: priceType === 'single' ? 0 : [0,1],
    category: "",
    tags: ["6706131d28bbe93c185b087d"],
    discount: 0,
    isBookingOpen: false,
    image: "",
    advertiserId: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      location: {
        lat: latlng.lat,
        lng: latlng.lng
      }
    }));
  }, [latlng]);

  useEffect(() => {
    async function fetchShit(){
        const tgs = await fetch(`http://localhost:5001/api/preference-tags`);
        setTags(await tgs.json());
        const catgs = await fetch(`http://localhost:5001/api/activity-categories`);
        setCategories(await catgs.json());
    }
    fetchShit()
    
  }, []);

  useEffect(() => {
    if (activity) setFormData(activity);
  }, [activity]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handlePriceChange = (e) => {
    const { name, value } = e.target;
  
    if (priceType === "single") {
      // If price is a single number
      setFormData((prev) => ({
        ...prev,
        price: Number(value), // Store price as a single number
      }));
    } else {
      // If price is an array with [min, max]
      setFormData((prev) => {
        const newPrice = [...(Array.isArray(prev.price) ? prev.price : [0, 0])]; // Default to [0, 0] if not an array
        const index = name === "min" ? 0 : 1; // Map "min" to index 0 and "max" to index 1
        newPrice[index] = Number(value); // Update min or max value in the array
        return {
          ...prev,
          price: newPrice,
        };
      });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    let title;
    let text;
    let isSuccess;
    try {
      if (activity) {
        const id = activity._id;
        response = await fetch(`http://localhost:5001/api/activities/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        title = "Activity Created";
        text = "Activity have been created successfully. You can now view it in your Dashboard.";
      } else {
        response = await fetch('http://localhost:5001/api/activities/manualActivity', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        title = "Data Saved";
        text = "Your changes have been saved successfully. The updated activity is now visible on your profile.";


      }
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("Success:", result);
      isSuccess = true;
    } catch (error) {
      console.error("Error:", error);
      isSuccess = false;
    }
    console.log(formData);
    setSubmissionResponse({text:{text}, isSuccess:{isSuccess}, title:{title}});
    setVisible(true);
  };
  // In a real application, you'd fetch these from your API
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`; // Format: yyyy-MM-ddThh:mm
  };


  return (
    <div>
      <div className="mb-5">
        {0 && 
          <FeedbackAlert 
            text={submissionResponse.text} 
            isSuccess={submissionResponse.isSuccess} 
            title={submissionResponse.title}
          />
        }
      </div>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
        <Button
          variant="ghost"
          className="absolute left-0 top-0 text-lg font-bold mt-4 ml-4 text-gray-600 hover:text-gray-800"
          onClick={() => navigate("/advertiserDashboard")}
        >
          Back
        </Button>
          <CardTitle className="text-2xl font-bold text-center">Activity Form</CardTitle>
          <CardDescription className="text-center">
            Enter the details for your Activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={formatDateForInput(formData.date)}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-full h-400">
              <MapCard setLatLng={setLatLng} />
            </div>

            <div>
              <Label>Price</Label>
              <Select onValueChange={(value) => setPriceType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select price type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Price</SelectItem>
                  <SelectItem value="range">Price Range</SelectItem>
                </SelectContent>
              </Select>
              {priceType === "single" ? (
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handlePriceChange}
                  className="mt-2"
                />
              ) : (
                <div className="flex space-x-4 mt-2">
                  <Input
                    name="min"
                    type="number"
                    placeholder="Min"
                    onChange={handlePriceChange}
                  />
                  <Input
                    name="max"
                    type="number"
                    placeholder="Max"
                    onChange={handlePriceChange}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Select
                name="tag"
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, tags: [...prev.tags, value]}))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag) => (
                    <SelectItem key={tag._id} value={tag._id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isBookingOpen"
                checked={formData.isBookingOpen}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isBookingOpen: checked }))
                }
              />
              <Label htmlFor="isBookingOpen">Is Booking Open</Label>
            </div>

            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                required
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="advertiserId">Advertiser ID</Label>
              <Input
                id="advertiserId"
                name="advertiserId"
                value={formData.advertiserId}
                onChange={handleInputChange}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default ActivityForm;