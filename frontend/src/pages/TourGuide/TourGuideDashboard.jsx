import React from "react";
import { Button } from "@/components/ui/button";  // Adjust path as per your setup
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from "react";
import ItineraryCard from "../../components/ItineraryCard/ItineraryCard";
import { fetchItineraries } from "./api/apiService.js";
import { Plus } from "lucide-react";
import DashboardsNavBar from "../../components/DashboardsNavBar.jsx";


const TourGuideDashboard = () => {
  const [itineraries, setItineraries] = useState([]);

  const getItineraries = useDebouncedCallback(async () => {
    const data = await fetchItineraries();
    setItineraries(data);
  }, 200);

  useEffect(() => {
      getItineraries();
  }, []); 

  return (
    <div className="container w-full mx-auto p-4 overflow-y: scroll min-h-[101vh]">
      <DashboardsNavBar profilePageString="/profileTemplate"/>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/4 mx-auto items-center jusitfy-center">
          <div className="flex items-center justify-between space-x-4 text-sm">
            <div>{itineraries.length} results</div>
            <Button className="bg-green-500" >
              <Plus className="mr-2 h-4 w-4" /> Create Itinerary
            </Button>
          </div>
          <ItineraryCard itineraries={itineraries} isTourGuide={true} />
        </div>
      </div>
    </div>
  );
};



export default TourGuideDashboard;