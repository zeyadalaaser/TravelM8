import React, { useState, useEffect } from "react";
import { Clock, Globe, Tag, Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2, MapPin } from "lucide-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Stars } from "../Stars";
import { useNavigate } from "react-router-dom";
import {
  flagItinerary,
  unflagItinerary,
} from "../../pages/admin/services/AdminItineraryService";
import { createItineraryBooking } from "../../pages/tourist/api/apiService";
import PaymentDialog from "../../pages/tourist/components/bookings/payment-dialog";

export default function ItineraryCard({
  itineraries,
  isAdmin,
  isTourist,
  currency,
  exchangeRate,
  onRefresh,
  isTourGuide,
  bookmarkedItineraries = [], // Add this prop
  handleBookmark = () => { },
}) {
  const navigate = useNavigate();

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
        alert(data.message);
        return;
      }
      await onRefresh();
      alert("Itinerary Deleted successfully");
      console.log("Success:", response);
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
            "Content-Type": "application/json", // Add the Content-Type header
          },
          body: JSON.stringify({ isBookingOpen: !isBookingOpen }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        alert(data.message);
        return;
      }
      onRefresh();
      alert(`Itinerary ${state} successfully`);
      console.log("Success:", response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const handleBook = async (itineraryId, tourGuideId) => {

  // };
  const fetchItineraries = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/itineraries");
      onRefresh();
    } catch (error) {
      console.error("Error fetching itineraries:", error.message);
    }
  };

  const [flaggedStatus, setFlaggedStatus] = useState({});

  useEffect(() => {
    const initialFlaggedStatus = itineraries.reduce((acc, itinerary) => {
      acc[itinerary._id] = itinerary.flagged;
      return acc;
    }, {});
    setFlaggedStatus(initialFlaggedStatus);
  }, [itineraries]);

  const toggleFlagItinerary = async (id, isFlagged) => {
    try {
      const endpoint = isFlagged
        ? `http://localhost:5001/api/itineraries/${id}/unflag`
        : `http://localhost:5001/api/itineraries/${id}/flag`;

      // Make the API request first
      await axios.put(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Then update the flag status in the state and show the alert simultaneously
      setFlaggedStatus((prev) => ({ ...prev, [id]: !isFlagged }));

      // Immediately show the alert after the update
      alert(
        isFlagged
          ? "Itinerary unflagged successfully!"
          : "Itinerary flagged successfully!"
      );

      // Optionally, refresh the parent component
      if (typeof onRefresh === "function") {
        onRefresh();
      }
    } catch (error) {
      console.error("Error toggling itinerary flag:", error.message);
      // If there's an error, revert the flag status
      setFlaggedStatus((prev) => ({ ...prev, [id]: isFlagged }));
    }
  };

  return (
    <>
      <div className="space-y-2">
        {itineraries?.map((itinerary) => (
          <Card key={itinerary._id}>
            <div className="flex flex-row">
              <div className="w-1/3">
                <img
                  src={
                    itinerary.images[0] ||
                    "/placeholder.svg?height=200&width=300"
                  }
                  alt={itinerary.name}
                  className="w-full min-h-full"
                />
              </div>
              <div className="flex flex-row w-2/3">
                <div className="flex-1 w-full p-4">
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold mb-2">
                      {itinerary.name}
                    </h3>
                    <div className="flex items-center gap-2 ">
                      {isTourGuide && itinerary.isBookingOpen && (
                        <Button
                          className="w-[150px] h-[38px] bg-sky-800 hover:bg-sky-900"
                          onClick={() =>
                            handleActivationToggle(
                              itinerary._id,
                              itinerary.isBookingOpen
                            )
                          }
                        >
                          Deactivate Itinerary
                        </Button>
                      )}
                      {isTourGuide && !itinerary.isBookingOpen && (
                        <Button
                          className="w-[150px] h-[38px] bg-sky-500 hover:bg-sky-600"
                          onClick={() =>
                            handleActivationToggle(itinerary._id, false)
                          }
                        >
                          Activate Itinerary
                        </Button>
                      )}
                      {isTourist && (
                        <>
                          <ShareButton id={itinerary._id} name="itinerary" />
                          <button
                            onClick={() => handleBookmark(itinerary._id)}
                            className={`text-gray-500 hover:text-black ${bookmarkedItineraries.includes(itinerary._id)
                              ? "text-yellow-400"
                              : ""
                              }`}
                          >
                            <Bookmark className="w-6 h-6" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <Stars rating={itinerary.averageRating} />
                    <span className="ml-2 text-sm text-gray-600">
                      {itinerary.totalRatings} reviews
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {itinerary.description}
                  </p>
                  {itinerary.activities.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600 mb-2 gap-2">
                      <Label className="text-m font-semibold text-black">
                        Activities:
                      </Label>
                      <div className="flex items-center gap-1">
                        {itinerary.activities.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm text-gray-600"
                          >
                            {activity} -
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {itinerary.historicalSites.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600 mb-2 gap-2">
                      <Label className="text-m font-semibold text-black">
                        Sites:
                      </Label>
                      <div className="flex items-center gap-1">
                        {itinerary.historicalSites.map((site, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm text-gray-600"
                          >
                            {site} -
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600 mb-2 gap-2">
                    <Label className="text-m font-semibold text-black">
                      Available Slots:
                    </Label>
                    <div className="flex items-center gap-4">
                      {itinerary.availableSlots.map((slot, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-600"
                        >
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
                      <Badge key={tagIndex} variant="secondary">
                        {tag?.name ?? tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-end items-center space-x-2">
                    <span className="text-xl font-bold mr-auto">{`${(
                      itinerary.price * 1
                    ).formatCurrency(currency)}`}</span>
                    <Timeline selectedItinerary={itinerary} />
                    {isTourist && (
                      <div className="flex justify-end items-center">
                        {/* <Button onClick={modalOpen(true)}>
                            Book Activity!
                          </Button> */}
                        <ChooseDate itinerary={itinerary} />
                      </div>
                    )}
                    {isTourGuide && (
                      <div className="flex items-center gap-2">
                        <Button
                          className="hover:bg-red-700"
                          onClick={() => handleDelete(itinerary._id)}
                          variant="destructive"
                        >
                          Delete
                        </Button>
                        <Button
                          variant="secondary"
                          className="hover:bg-gray-300"
                          onClick={() =>
                            navigate("/itineraryForm", {
                              state: { itinerary: itinerary },
                            })
                          }
                        >
                          Update
                        </Button>
                      </div>
                    )}
                    {isAdmin && (
                      <Button
                        className="w-100 mt-2 mb-2 bg-black hover:bg-gray-800"
                        variant="destructive"
                        onClick={() =>
                          toggleFlagItinerary(
                            itinerary._id,
                            flaggedStatus[itinerary._id]
                          )
                        }
                      >
                        {flaggedStatus[itinerary._id]
                          ? "Unflag Itinerary"
                          : "Flag as Inappropriate"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

const Timeline = ({ selectedItinerary }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Timeline</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Itinerary Timeline</DialogTitle>
        <div className="flex flex-col mt-4">
          {selectedItinerary?.timeline.map((event, index) => (
            <div key={index} className="flex items-center mb-2">
              <div className="w-4 h-4 bg-black rounded-full mr-2"></div>{" "}
              {/* Dot */}
              <div className="flex-1">
                <h4 className="font-semibold">{event.event}</h4>{" "}
                {/* Adjust based on your data structure */}
                <p>Start: {new Date(event.startTime).toLocaleString()}</p>
                <p>End: {new Date(event.endTime).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ChooseDate = ({ itinerary }) => {
  let remainingSpots;
  const [selectedDate, setSelectedDate] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("hello token from handlesubmit " + token);
    if (!selectedDate) {
      setSubmitStatus({ success: false, message: "Please select a date." });
      return;
    }
    if (token) {
      try {
        const response = await createItineraryBooking(
          itinerary._id,
          itinerary.tourGuideId._id, //tourguide doesnt get sent with the itinerary
          selectedDate,
          itinerary.price,
          "Card",
          token
        );
        setIsOpen(false);
        alert(response.data.message);
      } catch (error) {
        setIsOpen(false);
        alert("Failed to Book itinerary");
      }
    } else {
      alert("You need to be logged in to book an itinerary!");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen} >
        <DialogTrigger asChild>
          <Button>Book Now</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose Date</DialogTitle>
          </DialogHeader>
          <RadioGroup
            onValueChange={(value) => setSelectedDate(value)}
            className="space-y-2"
          >
            {itinerary.availableSlots.map((slot, index) => {
              const slotDate = new Date(slot.date).toLocaleDateString();
              const booked = slot.maxNumberOfBookings == 0;
              return (
                <div className="flex items-center space-x-2" key={index}>
                  <RadioGroupItem
                    disabled={booked}
                    value={slot.date}
                    id={`slot-${index}`} />
                  <Label
                    className={`${booked && "line-through text-gray-500"}`}
                    htmlFor={`slot-${index}`}
                  >
                    {slotDate}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
          <DialogFooter className="mt-4">
            <Button onClick={() => { setIsOpen(false); setPaymentOpen(true) }} disabled={!selectedDate}>
              Book
            </Button>
          </DialogFooter>
          {submitStatus && (
            <div
              className={`mt-4 p-4 rounded-md ${submitStatus.success ? "bg-green-100" : "bg-red-100"}`}
            >
              <div className="flex items-center">
                {submitStatus.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                )}
                <p
                  className={submitStatus.success ? "text-green-700" : "text-red-700"}
                >
                  {submitStatus.message}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <PaymentDialog isOpen={paymentOpen} onOpenChange={setPaymentOpen} amount={10000} />
    </>
  );
};
