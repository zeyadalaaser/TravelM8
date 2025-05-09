import React, { useState,useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { createItineraryBooking } from "../../pages/tourist/api/apiService";
import { toast } from "sonner";

export const ChooseDate = ({ itinerary,token }) => {
  const [selectedDate, setSelectedDate] = useState();
  const [submitStatus, setSubmitStatus] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const checkForToken = () => {
    console.log(token);
    if (!token) {
      toast('Please login to perform this action');
      setIsOpen(false);
    }
    else {
      setIsOpen(true);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!selectedDate) {
      setSubmitStatus({ success: false, message: "Please select a date." });
      return;
    }
    if (token) {
      try {
        const response = await createItineraryBooking(
          itinerary._id,
          itinerary.tourGuideId._id,
          selectedDate,
          itinerary.price,
          "Card",
          token
        );
        setIsOpen(false);
        toast(response.data.message);
      } catch (error) {
        setIsOpen(false);
        toast("Failed to Book itinerary");
      }
    } else {
      toast('Please login to perform this action');
    }
  };

  return (
    <Dialog  open={isOpen && token} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={() => {
            if (!token) {
              toast('Please login to perform this action');
            }
          }}
        >Book itinerary</Button>
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
            <Button className="text-white"type="submit">Choose date</Button>
          </DialogFooter>
        </form>
        {submitStatus && (
          <div
            className={`mt-4 p-4 rounded-md ${
              submitStatus.success ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <div className="flex items-center">
              {submitStatus.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <p
                className={
                  submitStatus.success ? "text-green-700" : "text-red-700"
                }
              >
                {submitStatus.message}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

