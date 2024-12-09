import React, { useState, useEffect } from "react";
import { Clock, Globe, Tag, Bookmark, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Stars } from "../Stars";
import { useNavigate } from "react-router-dom";
import { createItineraryBooking } from "../../pages/tourist/api/apiService";
import PaymentDialog from "../../pages/tourist/components/bookings/payment-dialog";

export default function ItineraryCard({
  itineraries,
  isAdmin,
  isTourist,
  currency,
  onRefresh,
  isTourGuide,
  bookmarkedItineraries = [],
  handleBookmark = () => {},
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [flaggedStatus, setFlaggedStatus] = useState({});
  const [notifiedItineraries, setNotifiedItineraries] = useState([]);
  const [activeDialogId, setActiveDialogId] = useState(null);

  useEffect(() => {
    const initialFlaggedStatus = itineraries.reduce((acc, itinerary) => {
      acc[itinerary._id] = itinerary.flagged;
      return acc;
    }, {});
    setFlaggedStatus(initialFlaggedStatus);
  }, [itineraries]);

  const handleNotifyMe = (itineraryId) => {
    if (notifiedItineraries.includes(itineraryId)) {
      toast(`Notification removed`, {
        description: `You will no longer receive updates for this itinerary`,
      });
      setNotifiedItineraries(prev => prev.filter(id => id !== itineraryId));
    } else {
      toast(`Notification added`, {
        description: `You will be notified when this itinerary becomes available`,
      });
      setNotifiedItineraries(prev => [...prev, itineraryId]);
    }
    setActiveDialogId(null);
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
        toast(`Failed to delete itinerary`, {
          description: `${data.message}`,
        });
        return;
      }
      await onRefresh();
      toast(`Success`, {
        description: `itinerary deleted successfully`,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleFlagItinerary = async (id, isFlagged) => {
    try {
      const endpoint = isFlagged
        ? `http://localhost:5001/api/itineraries/${id}/unflag`
        : `http://localhost:5001/api/itineraries/${id}/flag`;

      await axios.put(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFlaggedStatus((prev) => ({ ...prev, [id]: !isFlagged }));
      toast(isFlagged ? "Itinerary unflagged successfully!" : "Itinerary flagged successfully!");
      if (typeof onRefresh === "function") {
        onRefresh();
      }
    } catch (error) {
      console.error("Error toggling itinerary flag:", error.message);
      setFlaggedStatus((prev) => ({ ...prev, [id]: isFlagged }));
    }
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
      {itineraries?.map((itinerary) => (
        <Card
          key={itinerary._id}
          className="w-full max-w-[400px] mx-auto border border-gray-300 rounded-lg shadow-md flex flex-col overflow-hidden"
        >
          <img
            src={itinerary.images[0] || "/placeholder.svg?height=200&width=300"}
            alt={itinerary.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-semibold mb-2">{itinerary.name}</h3>
            <div className="flex items-center mb-2">
              <Stars rating={itinerary.averageRating} />
              <span className="ml-2 text-sm text-gray-600">{itinerary.totalRatings} reviews</span>
            </div>
            {itinerary.historicalSites.length > 0 && (
              <div className="flex items-center text-sm text-gray-600 mb-2 gap-2">
                <Label className="text-m font-semibold text-black">Sites:</Label>
                <div className="flex items-center gap-1">
                  {itinerary.historicalSites.map((site, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">{site} -</div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center text-sm text-gray-600 mb-2 gap-2">
              <Label className="text-m font-semibold text-black">Available Slots:</Label>
              <div className="flex items-center gap-4">
                {itinerary.availableSlots.map((slot, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{slot.date.slice(0, 10)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <Globe className="w-4 h-4 mr-1" />
              <Badge variant="secondary">{itinerary.tourLanguage}</Badge>
            </div>
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <Tag className="w-4 h-4 mr-1" />
              {itinerary.tags.map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="secondary">{tag?.name ?? tag}</Badge>
              ))}
            </div>
            <div className="flex justify-between items-center mt-auto">
              <span className="text-xl font-bold">{`${(itinerary.price * 1).formatCurrency(currency)}`}</span>
              <div className="flex items-center gap-2">
                {isTourGuide && (
                  <Button
                    className={`w-[150px] h-[38px] ${itinerary.isBookingOpen ? "bg-sky-800 hover:bg-sky-900" : "bg-sky-500 hover:bg-sky-600"}`}
                    onClick={() => handleActivationToggle(itinerary._id, itinerary.isBookingOpen)}
                  >
                    {itinerary.isBookingOpen ? "Deactivate" : "Activate"} Itinerary
                  </Button>
                )}
                {isTourist && (
                  <>
                    <ShareButton id={itinerary._id} name="itinerary" />
                    <button onClick={() => handleBookmark(itinerary._id)} className="text-gray-500 hover:text-black">
                      <Bookmark className={`w-6 h-6 ${bookmarkedItineraries.includes(itinerary._id) ? "fill-yellow-400 text-black" : "fill-none text-black"}`} />
                    </button>
                  </>
                )}
                {isTourGuide && (
                  <Button className="hover:bg-red-700" onClick={() => handleDelete(itinerary._id)} variant="destructive">
                    Delete
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    className={`w-[150px] h-[38px] ${flaggedStatus[itinerary._id] ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                    onClick={() => toggleFlagItinerary(itinerary._id, flaggedStatus[itinerary._id])}
                  >
                    {flaggedStatus[itinerary._id] ? "Unflag Itinerary" : "Flag as Inappropriate"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}