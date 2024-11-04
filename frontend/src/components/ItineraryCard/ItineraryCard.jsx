import React, { useState } from "react";
import { Clock, Globe, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogOverlay,
    DialogClose,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Stars } from "../Stars";

export default function ItineraryCard({ itineraries, isTourist, isTourGuide }) {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedItinerary, setSelectedItinerary] = useState(null);

    const handleViewTimeline = (itinerary) => {
        setSelectedItinerary(itinerary);
        setDialogOpen(true);
    };

    return (
        <>
            <div className="mx-4 mt-3 space-y-4"> {/* Adjusted left alignment and margin */}
                {itineraries?.map((itinerary) => (
                    <Card key={itinerary._id} className="ml-4 p-4"> {/* Left-aligned with margin */}
                        <div className="flex flex-row">
                            <div className="flex-1 w-full md:w-2/3 p-4">
                                <div className="flex justify-between">
                                    <h3 className="text-xl font-semibold mb-2">{itinerary.name}</h3>
                                    <Button variant="outline" onClick={() => handleViewTimeline(itinerary)}>
                                        View Timeline
                                    </Button>
                                </div>
                                <div className="flex items-center mb-2">
                                    <Stars rating={itinerary.averageRating} />
                                    <span className="ml-2 text-sm text-gray-600">{itinerary.totalRatings} reviews</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{itinerary.description}</p>
                                {itinerary.activities.length > 0 &&
                                    <div className="flex items-center text-sm text-gray-600 mb-2 gap-2">
                                        <Label className="text-m font-semibold text-black">Activities:</Label>
                                        <div className="flex items-center gap-1">
                                            {itinerary.activities.map((activity, index) => (
                                                <div key={index} className="flex items-center text-sm text-gray-600">
                                                    {activity} -
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                }
                                {itinerary.historicalSites.length > 0 &&
                                    <div className="flex items-center text-sm text-gray-600 mb-2 gap-2">
                                        <Label className="text-m font-semibold text-black">Sites:</Label>
                                        <div className="flex items-center gap-1">
                                            {itinerary.historicalSites.map((site, index) => (
                                                <div key={index} className="flex items-center text-sm text-gray-600">
                                                    {site} -
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                }
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
                                <div className="text-xl font-bold">{`$${itinerary.price}`}</div>
                                <div className="flex justify-end items-center">
                                    {isTourist && <Button>Book Tour!</Button>}
                                    {isTourGuide && (
                                        <div className="flex items-center gap-2">
                                            <Button>Update</Button>
                                            <Button variant="destructive">Delete</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogOverlay />
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
                    <DialogClose asChild>
                        <Button onClick={() => setDialogOpen(false)}>Close</Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </>
    );
}
