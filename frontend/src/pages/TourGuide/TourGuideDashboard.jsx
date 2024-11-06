import React,  { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";  // Adjust path as per your setup
import { useDebouncedCallback } from 'use-debounce';
import ItineraryCard from "../../components/ItineraryCard/ItineraryCard";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardsNavBar from "../../components/DashboardsNavBar.jsx";

const TourGuideDashboard = () => {
  const navigate = useNavigate();

  const [itineraries, setItineraries] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const refreshItineraries = () => {
      setRefresh((prev) => !prev); // Toggles to trigger a refresh
  };
  
  const getItineraries = useDebouncedCallback(async () => {
    const response = await fetch('http://localhost:5001/api/FilterItineraries')
    setItineraries(await response.json());
  }, 500);

  useEffect(() => {
      getItineraries();
  }, [refresh]);


  // useEffect(() => {
  //     getItineraries();
  // }, []); 


  return (
    <>
      <div className="container w-full mx-auto p-4 overflow-y: scroll min-h-[101vh]">
        <DashboardsNavBar profilePageString="/tourGuideProfile"/>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-3/4 mx-auto items-center jusitfy-center">
            <div className="flex items-center justify-between space-x-4 text-sm">
              <div>{itineraries.length} results</div>
              <Button onClick={() => navigate("/itineraryForm")} className="bg-green-500" >
                <Plus className="mr-2 h-4 w-4" /> Create Itinerary
              </Button>
            </div>
            <ItineraryCard itineraries={itineraries} currency= {"USD"} onRefresh={refreshItineraries} isTourGuide={true} />
          </div>
        </div>
      </div>
  </>
  );
};

export default TourGuideDashboard;