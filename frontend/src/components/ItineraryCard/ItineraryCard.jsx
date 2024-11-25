import React, { useState } from "react";
import { Clock, Globe, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";

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
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2 } from "lucide-react"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Stars } from "../Stars";
import { useNavigate } from "react-router-dom";
import { flagItinerary } from "../../pages/admin/services/AdminItineraryService";
import { createItineraryBooking } from "../../pages/tourist/api/apiService";

const token = localStorage.getItem('token');


export default function ItineraryCard({
  itineraries,
  isAdmin,
  isTourist,
  currency,
  exchangeRate,
  onRefresh,
  isTourGuide,
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
      const response = await fetch(`http://localhost:5001/api/itineraries/${id}`,
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
  }

  // const handleBook = async (itineraryId, tourGuideId) => {


  // }; 

  const handleFlagItinerary = async (itineraryId) => {
    try {
      await flagItinerary(itineraryId);
      alert("Itinerary flagged successfully");
    } catch (error) {
      console.error("Error flagging itinerary:", error);
      alert("Failed to flag itinerary");
    }
  };

  return (
    <>
      <div className="w-full mx-auto m-3 space-y-2">
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
                      {isTourist && <ShareButton id={itinerary._id} name="itinerary" />}
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
                    <span className="text-xl font-bold mr-auto">{`${(itinerary.price * 1).toFixed(2)} ${currency}`}</span>
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
                        className="hover:bg-red-700"
                        variant="destructive"
                        onClick={() => handleFlagItinerary(itinerary._id)}
                      >
                        Flag as Inappropriate
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
}

const ChooseDate = ({ itinerary }) => {
  let remainingSpots;
  const [selectedDate, setSelectedDate] = useState();
  const [submitStatus, setSubmitStatus] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    let message;
    e.preventDefault();
    if (!selectedDate) {
      setSubmitStatus({ success: false, message: "Please select a date." });
      return;
    }

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
      alert(response.data.message)
      // setSubmitStatus({ success: response.message.success, message: message });
    } catch (error) {
      setIsOpen(false);
      alert("Failed to Book itinerary");
      // setSubmitStatus({ success: false, message: "failed" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Book Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose Date</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <RadioGroup
            onValueChange={(value) => setSelectedDate(value)}
            className="space-y-2"
          >
            {itinerary.availableSlots.map((slot, index) => {
              const slotDate = new Date(slot.date).toLocaleDateString();
              return (
                <div className="flex items-center space-x-2" key={index}>
                  <RadioGroupItem value={slot.date} id={`slot-${index}`} />
                  <Label htmlFor={`slot-${index}`}>{slotDate}</Label>
                </div>
              );
            })}
          </RadioGroup>
          <DialogFooter className="mt-4">
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
        {submitStatus && (
          <div className={`mt-4 p-4 rounded-md ${submitStatus.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex items-center">
              {submitStatus.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <p className={submitStatus.success ? 'text-green-700' : 'text-red-700'}>
                {submitStatus.message}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
