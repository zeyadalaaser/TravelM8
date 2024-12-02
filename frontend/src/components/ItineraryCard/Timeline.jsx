import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Timeline = ({ selectedItinerary }) => {
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
              <div className="w-4 h-4 bg-black rounded-full mr-2"></div>
              <div className="flex-1">
                <h4 className="font-semibold">{event.event}</h4>
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

