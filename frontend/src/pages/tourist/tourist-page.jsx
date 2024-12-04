
import useRouter from "@/hooks/useRouter";
import { useEffect, useState } from "react";
import axios from "axios";
import { ActivitiesPage } from "./components/activities/activities-page";
import { ProductsPage } from "./components/products/products-page";
import { MyComplaintsPage } from "@/pages/tourist/components/complaints/myComplaints.jsx";
import { NavBar } from "./components/nav-bar";
import { MuseumsPage } from "./components/museums/museums-page";
import { CircleUserRound, Award } from "lucide-react";
import Footer from "@/components/Footer.jsx"
import { ItinerariesPage } from "./components/itineraries/itineraries-page";

import { ComplaintForm } from "./components/complaints/complaint-form";
import { CompletedToursPage } from "./components/itineraries/CompletedToursPage";
import { PastActivitiesPage } from "./components/activities/PastActivitiesPage";
import PurchasedProductsPage from "./components/products/PurchasedProductsPage";
import { FlightsPage } from "./components/flights/flights-page";
import { HotelsPage } from "./components/hotels/hotels-page";
import DashboardsNavBar from "../../components/DashboardsNavBar.jsx";
import { RedeemPoints } from "./components/Points/redeemPoints"
import BookingHistory from "./components/bookings/BookingHistory.jsx";
import Navbar from "../../components/Navbar.jsx";



export default function TouristPage() {
  const { location, navigate, searchParams } = useRouter();
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showRedeemPoints, setShowRedeemPoints] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState("");
  const [touristId, setTouristId] = useState(null);
  //navigate(`/preferences-page/${touristId}`);

  function getUserFromToken(token) {
    if (!token) return {};
    const decoded = JSON.parse(atob(token.split(".")[1])); 
    console.log("User ID:", decoded.userId);
    return { id: decoded.userId, role: decoded.role }; 
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const fetchBadgeInfo = async () => {
    const token = localStorage.getItem("token"); 
    if (!token) return;

    try {
      const response = await axios.get(
        "http://localhost:5001/api/tourists/myProfile",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { loyaltyPoints, badgeLevel } = response.data;
      setTotalPoints(loyaltyPoints);
      setLevel(badgeLevel);
    } catch (error) {
      console.error("Error fetching badge info:", error);
    }
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     navigate("/"); // Redirect to login page if no token
  //     return;
  //   }

  //   const { role, id } = getUserFromToken(token);
  //   if (role !== "Tourist") {
  //     navigate("/"); // Redirect if the role is not 'tourist'
  //     return;
  //   }
  //   setTouristId(id);
  //   // Fetch badge information once the token is verified
  //   fetchBadgeInfo();

  // }, [navigate]);



  useEffect(() => {
    if (!searchParams.has("type")) {
      searchParams.set("type", "activities");
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }
  }, [location.pathname, navigate, searchParams]);


  const page = searchParams.get("type");

  return (


    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 overflow-y: scroll min-h-[101vh]">

        <Navbar profilePageString={"/tourist-profile"} />
        <div className="mt-24">
          {/* <NavBar onComplaintClick={() => setShowComplaintForm(true)}
          onRedeemClick={() => setShowRedeemPoints(true)} /> */}

        </div>

        {page === "activities" && <ActivitiesPage />}
        {page === "itineraries" && <ItinerariesPage />}
        {page === "museums" && <MuseumsPage />}
        {page === "flights" && <FlightsPage />}
        {page === "hotels" && <HotelsPage />}
        {page === "products" && (<ProductsPage />)}
        {page === "complaints" && <MyComplaintsPage />}
        {page === "completed-tours" && touristId && (<CompletedToursPage touristId={touristId} />)}
        {page === "past-activities" && touristId && (<PastActivitiesPage touristId={touristId} />)}
        {page === "products-purchased" && touristId && (<PurchasedProductsPage touristId={touristId} />)}
        {page === "booking-history" && <BookingHistory />}
        {showComplaintForm && (<ComplaintForm onClose={() => setShowComplaintForm(false)} />)}
        {showRedeemPoints && (<RedeemPoints onClose={() => setShowRedeemPoints(false)} />)}


      </div>
      <div className="mt-36">
        <Footer />
      </div>
    </div>

  );

}
