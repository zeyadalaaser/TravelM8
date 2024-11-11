import React, { useState, useEffect } from "react";
import { useDebouncedCallback } from 'use-debounce';
import DashboardsNavBar from "../../components/DashboardsNavBar.jsx";
import ActivityCard from "../../components/ActivityCard/ActivityCard.jsx";
import ActivityFormDialog from "./ActivityForm.jsx";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdvertiserDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogArgs, setDialogArgs] = useState(null);

  // Function to open the dialog, set the trigger source, and pass arguments
  const openDialog = (args) => {
    if (args)
      setDialogArgs(args.activity);
    else
      setDialogArgs(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogArgs(null);
  };



  // const getActivities = useDebouncedCallback(async () => {
  //   const response = await fetch("http://localhost:5001/api/activities");
  //   setActivities(await response.json());
  // }, 200);

  // useEffect(() => {
  //   getActivities();
  // }, []);

  const getActivities = useDebouncedCallback(async () => {
    try {
      const response = await fetch("http://localhost:5001/api/activities");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  }, 200);
  
  useEffect(() => {
    getActivities();
    // Clean up to prevent memory leaks if the component unmounts
    return () => getActivities.cancel();
  }, [getActivities]);
  

  return (
    <>
      <div className="container w-full mx-auto p-4 overflow-y: scroll min-h-[101vh]">
        <DashboardsNavBar profilePageString="/advertiserProfile" />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-3/4 mx-auto items-center jusitfy-center">
            <div className="flex items-center justify-between mb-3 space-x-4 text-sm">
              <div>{activities.length} results</div>
              <Button onClick={() => openDialog(null)} className="bg-green-500" >
                <Plus className="mr-2 h-4 w-4" /> Create Activity
              </Button>
            </div>
            <ActivityCard onRefresh={getActivities} activities={activities} isAdvertiser={true} openDialog={openDialog} />
            <ActivityFormDialog
              isOpen={isDialogOpen}
              onClose={closeDialog}
              dialogArgs={dialogArgs}
              onRefresh={getActivities}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvertiserDashboard;