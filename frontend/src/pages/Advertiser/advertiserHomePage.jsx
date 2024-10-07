import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";  // Adjust path as per your setup
import useRouter from "@/hooks/useRouter"
import { useEffect } from "react";

const token = localStorage.getItem('token');


const AdvertiserHomePage = () => {
  const navigate = useRouter();
  const navigate2 = useNavigate();

  useEffect(() => {
    // Redirect if no token is found
    if (!token) 
      navigate("/login");
  }, [token, navigate]); // Include token in dependency array


  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold mb-6">Advertiser Home Page</h1>
      <Button onClick={() => navigate2("/advertiserProfile")} className="w-48">
        Go to Profile
      </Button>
      <Button onClick={() => navigate2("/advertiserActivities")} className="w-48">
        Go to Activities
      </Button>
    </div>
  );
};

export default AdvertiserHomePage;
