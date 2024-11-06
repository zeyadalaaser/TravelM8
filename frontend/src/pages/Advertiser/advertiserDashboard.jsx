import React,  { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";  // Adjust path as per your setup
import { useDebouncedCallback } from 'use-debounce';
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardsNavBar from "../../components/DashboardsNavBar.jsx";
import ActivityCard from "../../components/ActivityCard/ActivityCard.jsx";

const AdvertiserDashboard = () => {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);


  const getActivities = useDebouncedCallback(async () => {
    const response = await fetch(`http://localhost:5001/api/activities`)
    setActivities(await response.json());
  }, 200);

  useEffect(() => {
      getActivities();
  }, [activities]); 


  return (
    <>
      <div className="container w-full mx-auto p-4 overflow-y: scroll min-h-[101vh]">
        <DashboardsNavBar profilePageString="/advertiserProfile"/>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-3/4 mx-auto items-center jusitfy-center">
            <div className="flex items-center justify-between mb-3 space-x-4 text-sm">
              <div>{activities.length} results</div>
              <Button onClick={() => navigate("/activityForm")} className="bg-green-500" >
                <Plus className="mr-2 h-4 w-4" /> Create Activity
              </Button>
            </div>
            <ActivityCard activities={activities} isAdvertiser={true} />
          </div>
        </div>
      </div>
  </>
  );
};

export default AdvertiserDashboard;