import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import MapCard from "../../components/Map/MapCard";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

const ActivityFormDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [latlng, setLatLng] = useState({ name: "", lat: 0, lng: 0 });
  const [priceType, setPriceType] = useState("single");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: { name: latlng.name, lat: latlng.lat, lng: latlng.lng },
    price: priceType === "single" ? 0 : [0, 1],
    category: "",
    tags: [],
    discount: 0,
    isBookingOpen: false,
    image: "",
    advertiserId: "",
  });

  useEffect(() => {
    async function fetchData() {
      const tagsResponse = await fetch(
        `http://localhost:5001/api/preference-tags`
      );
      const tagsData = await tagsResponse.json();
      setTags(tagsData);

      const categoriesResponse = await fetch(
        `http://localhost:5001/api/activity-categories`
      );
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    if (priceType === "single") {
      setFormData((prev) => ({ ...prev, price: Number(value) }));
    } else {
      setFormData((prev) => {
        const newPrice = [...(Array.isArray(prev.price) ? prev.price : [0, 0])];
        const index = name === "min" ? 0 : 1;
        newPrice[index] = Number(value);
        return { ...prev, price: newPrice };
      });
    }
  };

  const handleTagSelect = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const handleRemoveTag = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((id) => id !== tagId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement your submit logic here
    console.log(formData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} className="w-auto" onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Activity Form</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Activity Form</DialogTitle>
          <DialogDescription>
            Enter the details for your Activity.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
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
                value={formData.date}
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
              <Select onValueChange={handleTagSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tags" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag) => (
                    <SelectItem key={tag._id} value={tag._id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tagId) => {
                  const tag = tags.find((t) => t._id === tagId);
                  return (
                    <Badge key={tagId} variant="secondary">
                      {tag?.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => handleRemoveTag(tagId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
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
                onChange={handleInputChange}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ActivityFormDialog;
