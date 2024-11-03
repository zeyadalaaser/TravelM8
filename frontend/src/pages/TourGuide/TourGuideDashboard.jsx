import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";  // Adjust path as per your setup
import { CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";


export default TourGuideHomeDashboard = () => {
  const navigate = useNavigate();
  const page = searchParams.get("type");

  return (
    <>
    <div className=" w-full h-auto flex justify-between items-center m-4" ></div>


    <div className="container mx-auto p-4 overflow-y: scroll min-h-[101vh]">
      <h1 className="text-2xl font-bold mb-4">TravelM8</h1>
      <CircleUserRound
        className="cursor-pointer h-10 w-10"
        onClick={() => navigate("/profileTemplate")}
      />
    
      {page === "myItineraries" && <ItinerariesPage />}
      
    </div>
    </>
  );
};


