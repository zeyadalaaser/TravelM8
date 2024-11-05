// Import required libraries and hooks
import useRouter from "@/hooks/useRouter";
import { useEffect, useState } from "react";
import axios from "axios";
import { ActivitiesPage } from "./components/activities/activities-page";
import { ProductsPage } from "./components/products/products-page";
import { MyComplaintsPage } from "@/pages/tourist/components/complaints/myComplaints.jsx";
import { NavBar } from "./components/nav-bar";
import { MuseumsPage } from "./components/museums/museums-page";
import { CircleUserRound, Award } from "lucide-react";
import { ItinerariesPage } from "./components/itineraries/itineraries-page";
import { ComplaintForm } from "./components/complaints/complaint-form";
import { CompletedToursPage } from "./components/itineraries/CompletedToursPage";
import { RedeemPoints } from "./components/Points/redeemPoints";

export default function TouristPage() {
  const { location, navigate, searchParams } = useRouter();
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showRedeemPoints, setShowRedeemPoints] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState("");

  // Function to decode JWT and get user role
  function getRoleFromToken(token) {
    const decoded = JSON.parse(atob(token.split(".")[1])); // Decode the token
    return decoded.role; // Get the role from the token
  }

  // Fetch tourist's badge information from the backend
  const fetchBadgeInfo = async () => {
    const token = localStorage.getItem("token"); // Get token within the function scope
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:5001/api/tourists/myProfile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const { loyaltyPoints, badgeLevel } = response.data; // Adjust according to your schema
      setTotalPoints(loyaltyPoints);
      setLevel(badgeLevel);
    } catch (error) {
      console.error("Error fetching badge info:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if no token
      return;
    }

    // Decode the JWT token to get the role
    const userRole = getRoleFromToken(token);
    if (userRole !== "Tourist") {
      navigate("/login"); // Redirect if the role is not 'Tourist'
      return;
    }
    // Fetch badge information once the token is verified
    fetchBadgeInfo();
  }, [navigate]);

  useEffect(() => {
    if (!searchParams.has("type")) searchParams.set("type", "activities");
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  }, []);

  const page = searchParams.get("type");

  return (
    <div className="container mx-auto p-4 overflow-y-scroll min-h-[101vh]">
      <h1 className="text-2xl font-bold mb-4">TravelM8</h1>
      <div className="flex justify-between items-center">
        <NavBar onComplaintClick={() => setShowComplaintForm(true)} onRedeemClick={() => setShowRedeemPoints(true)} />
        <div className="flex items-center">
          {/* Badge Display with Styling */}
          <div className="badge-container flex items-center p-2 rounded-full shadow-md bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm mr-2">
            <Award className="w-4 h-4 mr-1" />
            <div className="text-center">
              <p className="font-semibold">{level || "Loading..."}</p>
              <p className="text-xs">{totalPoints || 0} Points</p>
            </div>
          </div>
          <CircleUserRound className="cursor-pointer h-10 w-10" onClick={() => navigate("/tourist-profile")} />
        </div>
      </div>

      {page === "activities" && <ActivitiesPage />}
      {page === "itineraries" && <ItinerariesPage />}
      {page === "museums" && <MuseumsPage />}
      {page === "products" && <ProductsPage />}
      {page === "complaints" && <MyComplaintsPage />}
      {page === "completed-tours" && <CompletedToursPage />}
      {showComplaintForm && <ComplaintForm onClose={() => setShowComplaintForm(false)} />}
      {showRedeemPoints && <RedeemPoints onClose={() => setShowRedeemPoints(false)} />}
    </div>
  );
}
