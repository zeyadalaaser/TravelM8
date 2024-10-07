import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";  // Adjust path as per your setup

const AdvertiserHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold mb-6">Advertiser Home Page</h1>
      <Button onClick={() => navigate("/Advertiser")} className="w-48">
        Go to Profile
      </Button>
      <Button onClick={() => navigate("/Advertiser")} className="w-48">
        Go to Activities
      </Button>
    </div>
  );
};

export default AdvertiserHomePage;
