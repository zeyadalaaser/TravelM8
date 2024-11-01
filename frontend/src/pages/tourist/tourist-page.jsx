import useRouter from "@/hooks/useRouter"
import { useEffect, useState } from "react";

import { ActivitiesPage } from "./components/activities/activities-page";
import { ProductsPage } from "./components/products/products-page";
import { MyComplaintsPage } from "@/pages/tourist/components/complaints/myComplaints.jsx";
import { NavBar } from "./components/nav-bar";
import { MuseumsPage } from "./components/museums/museums-page";
import { CircleUserRound } from "lucide-react";
import { ItinerariesPage } from "./components/itineraries/itineraries-page";
import { ComplaintForm } from "./components/complaints/complaint-form"

export default function TouristPage() {

  const { location, navigate, searchParams } = useRouter();
  const [showComplaintForm, setShowComplaintForm] = useState(false)

  // Function to decode JWT and get user role
  function getRoleFromToken(token) {
    const decoded = JSON.parse(atob(token.split(".")[1])); // Decode the token
    return decoded.role; // Get the role from the token
  }

  useEffect(() => {
    // Check if the user has a token
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      navigate("/login"); // Redirect to login page if no token
      return;
    }

    // Decode the JWT token to get the role
    const userRole = getRoleFromToken(token);
    if (userRole !== "Tourist") {
      navigate("/login"); // Redirect if the role is not 'tourist'
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!searchParams.has("type"))
      searchParams.set("type", "activities");
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  }, []);

  const page = searchParams.get("type");

  return (
    <div className="container mx-auto p-4 overflow-y: scroll min-h-[101vh]">
      <h1 className="text-2xl font-bold mb-4">TravelM8</h1>
      <div className="flex justify-between">
      <NavBar onComplaintClick={() => setShowComplaintForm(true)} />
      <CircleUserRound
            className="cursor-pointer h-10 w-10" 
            onClick={() => navigate('/tourist-profile')}
        />
      </div>
      {page === "activities" && <ActivitiesPage />}
      {page === "itineraries" && <ItinerariesPage />}
      {page === "museums" && <MuseumsPage />}
      {page === "products" && <ProductsPage />}
      {page === "complaints" && <MyComplaintsPage />}
      {showComplaintForm && (
        <ComplaintForm onClose={() => setShowComplaintForm(false)} />
      )}
    </div>
  )
}

