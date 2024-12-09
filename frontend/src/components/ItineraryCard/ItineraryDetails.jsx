import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Clock, Globe, Tag, Calendar, Users, CalendarClock} from 'lucide-react';
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
import { flagItinerary } from "../../pages/admin/services/AdminItineraryService";
// import { Timeline } from './Timeline';
import { ChooseDate } from './ChooseDate';
import { toast } from "sonner";
import axios from "axios";
import {Stars} from "../Stars.jsx"
export default function ItineraryDetails({ itinerary, isAdmin, isTourist, isTourGuide, onRefresh,currency,token }) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isToken,setToken]=useState(true);
  const [reviews, setReviews] = useState({});

  const getReviews = async (entityId) => {
    try {
        // Construct query parameters
        const params = {
            entityId,
            entityType:"Itinerary",
        };

        const response = await axios.get('http://localhost:5001/api/ratings', { params });

        console.log('Reviews:', response.data.reviews);
        console.log('Average Rating:', response.data.averageRating);
        setReviews(response.data.reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
};



  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/itineraries/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const data = await response.json();
        toast(data.message);
        return;
      }
      await onRefresh();
      toast("Itinerary Deleted successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleActivationToggle = async (id, isBookingOpen) => {
    const state = isBookingOpen ? "Deactivated" : "Activated";
    try {
      const response = await fetch(
        `http://localhost:5001/api/itineraries/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isBookingOpen: !isBookingOpen }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        toast(data.message);
        return;
      }
      onRefresh();
      toast(`Itinerary ${state} successfully`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFlagItinerary = async (itineraryId) => {
    try {
      await flagItinerary(itineraryId);
      toast("Itinerary flagged successfully");
    } catch (error) {
      console.error("Error flagging itinerary:", error);
      toast("Failed to flag itinerary");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => getReviews(itinerary)} variant="outline">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {itinerary.name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 h-full">
          <div className="w-2/5 flex-shrink-0">
            <div className="aspect-square overflow-hidden rounded-lg mb-2">
              <img
                src={
                  itinerary.images[selectedImage] ||
                  "/placeholder.svg?height=300&width=300"
                }
                alt={itinerary.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {itinerary.images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square overflow-hidden rounded-md ${
                    index === selectedImage ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image || "/placeholder.svg?height=100&width=100"}
                    alt={`${itinerary.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div
            className="w-2/3 overflow-y-auto pr-4"
            style={{ maxHeight: "calc(80vh - 150px)" }}
          >
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Globe className="w-4 h-4" />
                <Badge variant="secondary">{itinerary.tourLanguage}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Tag className="w-4 h-4" />
                {itinerary.tags.map((tag, tagIndex) => (
                  <Badge
                    key={tagIndex}
                    className="space-x-12"
                    variant="secondary"
                  >
                    {tag?.name ?? tag}
                  </Badge>
                ))}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {itinerary.description}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Activities</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {itinerary.activities.map((activity, index) => (
                    <Badge key={index} variant="secondary">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Historical Sites</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {itinerary.historicalSites.map((site, index) => (
                    <Badge key={index} variant="secondary">
                      {site}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Timeline</h3>
                <div className="relative space-y-8 before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:-ml-px before:bg-gray-200">
                  {itinerary.timeline.map((event, index) => (
                    <div
                      key={index}
                      className="relative flex items-start group"
                    >
                      <div className="absolute left-0 h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-white">
                        <CalendarClock className="h-4 w-4" />
                      </div>
                      <div className="ml-12 space-y-1">
                        <div className="text-lg font-semibold text-gray-900">
                          {event.event}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(event.startTime).toLocaleString()} -{" "}
                          {new Date(event.endTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Available Dates</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {itinerary.availableSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 border rounded-md"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {new Date(slot.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator></Separator>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Reviews and Comments
                </h3>
                {reviews && reviews.length > 0 ? (
                  <ul className="space-y-4">
                    {reviews.map((review, index) => (
                      <li key={index} className="border-b pb-4 last:border-b-0">
                          <span className="font-medium">{review.userId.username}</span>
                          <Stars rating={review.rating} />
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      </li>
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
            {`${(itinerary.price * 1).formatCurrency(currency)}`}
          </span>
          <div className="flex items-center space-x-4">
            {isTourist && <ChooseDate itinerary={itinerary} token={token} />}
          </div>
        </div>
        {(isTourGuide || isAdmin) && (
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            {isTourGuide && (
              <>
                <Button
                  className={
                    itinerary.isBookingOpen
                      ? "bg-sky-800 hover:bg-sky-900"
                      : "bg-sky-500 hover:bg-sky-600"
                  }
                  onClick={() =>
                    handleActivationToggle(
                      itinerary._id,
                      itinerary.isBookingOpen
                    )
                  }
                >
                  {itinerary.isBookingOpen ? "Deactivate" : "Activate"}{" "}
                  Itinerary
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(itinerary._id)}
                >
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate("/itineraryForm", {
                      state: { itinerary: itinerary },
                    })
                  }
                >
                  Update
                </Button>
              </>
            )}
            {isAdmin && (
              <Button
                variant="destructive"
                onClick={() => handleFlagItinerary(itinerary._id)}
              >
                Flag as Inappropriate
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// function TimelineEvent(item) {
//   return (
//     <div className="relative flex items-start group">
//       <div className="absolute left-0 h-8 w-8 rounded-full bg-black-200 flex items-center justify-center text-white">
//         <CalendarClock className=" h-4 w-4" />
//       </div>
//       <div className="ml-12 space-y-1">
//         <div className="text-lg font-semibold text-gray-900">{item.event}</div>
//         <div className="text-sm text-gray-500">
//           {new Date(item.startTime).toLocaleString()} - {new Date(item.endTime).toLocaleString()}
//         </div>
//       </div>
//     </div>
//   )
// }

