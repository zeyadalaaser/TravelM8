import React, { useState,useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Clock, Globe, Tag, Calendar, Users, MapPin,ChartColumnStacked } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { Stars } from "../Stars.jsx";

export default function ActivityDetails({ activity, bookActivity,currency,token }) {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);


  const handleBook = async (activity) => {
    console.log(token);
    if (token) {
      const response = await bookActivity(activity._id, activity.price, "Card", token);
      console.log(response.message);
      toast(`Success`, {
        description: `Activity booked successfully`,
      });
    }
    else
    toast('Please login to perform this action');
  }
  useEffect(() => {
    if (!token) return; 
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token"); 
        navigate("/"); 
      } else {
        const timeout = setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/");
        }, (decodedToken.exp - currentTime) * 1000);

        return () => clearTimeout(timeout);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token"); 
      navigate("/");
    }
  }, [token, navigate]);

  const getReviews = async (entityId) => {
    try {
      // Construct query parameters
      const params = {
        entityId,
        entityType: "Activity",
      };

      const response = await axios.get("http://localhost:5001/api/ratings", {
        params,
      });

      console.log("Reviews:", response.data.reviews);
      console.log("Average Rating:", response.data.averageRating);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button onClick={()=> getReviews(activity)} variant="outline">View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{activity.title}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 h-full">
          <div className="w-2/5 flex-shrink-0">
            <div className="aspect-square overflow-hidden rounded-lg mb-2">
              <img
                src={activity.image || "/placeholder.svg?height=300&width=300"}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="w-2/3 overflow-y-auto pr-4" style={{ maxHeight: "calc(80vh - 150px)" }}>
            <div className="space-y-4">
              <div className="flex items-center mt-2 gap-2">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(activity.date).toLocaleDateString('en-GB')}
              </div>
              <div className="flex flex-wrap gap-2">
                <Tag className="w-4 h-4" />
                {activity.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} className="space-x-12" variant="secondary">
                    {tag?.name ?? tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <ChartColumnStacked className="w-4 h-4 mr-1" />
                <Badge className="space-x-12" variant="secondary">
                  {activity.category.name}
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <p className="text-sm text-muted-foreground">{activity?.location?.name}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Reviews and Comments
                </h3>
                {reviews && reviews.length > 0 ? (
                  <ul className="space-y-4">
                    {reviews.map((review, index) => (
                      <div key={review.id} className="flex space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-sm">
                            {review.userId?.username?review.userId.username:"Anonymous"}
                            </h5>
                            <div className="flex items-center">
                              <Stars rating={review?.rating} />
                            </div>
                          </div>
                          <p className="text-sm italic text-muted-foreground">
                            &quot;{review?.comment}&quot;
                          </p>
                        </div>
                      </div>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No reviews yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4 bg-gray-100 justify-between w-full p-4 rounded-lg">
          <span className="text-2xl font-bold">
          {`${(activity.price * 1).formatCurrency(currency)}`}
          </span>
          <Button onClick={() => handleBook(activity)}>Book activity</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


