import useRouter from "@/hooks/useRouter";
import { useEffect, useState } from "react";
import { ActivitiesPage } from "./components/activities/activities-page";
import { ProductsPage } from "./components/products/products-page";
import { MyComplaintsPage } from "@/pages/tourist/components/complaints/myComplaints.jsx";
import { NavBar } from "./components/nav-bar";
import { MuseumsPage } from "./components/museums/museums-page";
import { CircleUserRound } from "lucide-react";
import { ItinerariesPage } from "./components/itineraries/itineraries-page";
import { ComplaintForm } from "./components/complaints/complaint-form";
import { CompletedToursPage } from "./components/itineraries/CompletedToursPage";
import { PastActivitiesPage } from "./components/activities/PastActivitiesPage";
import  PurchasedProductsPage   from "./components/products/PurchasedProductsPage";

export default function TouristPage() {
  const { location, navigate, searchParams } = useRouter();
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [touristId, setTouristId] = useState(null);

  // Function to decode JWT and get user role and id
  function getUserFromToken(token) {
    if (!token) return {};
    const decoded = JSON.parse(atob(token.split(".")[1])); // Decode the token
    console.log("User ID:", decoded.userId);
    return { id: decoded.userId ,role: decoded.role}; // Get the role and tourist ID from the token
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
 
    if (!token) {
      navigate("/login"); // Redirect to login page if no token
      return;
    }

    const { role, id } = getUserFromToken(token);
    if (role !== "Tourist") {
      navigate("/login"); // Redirect if the role is not 'tourist'
      return;
    }

    setTouristId(id);
  }, [navigate]);

  useEffect(() => {
    if (!searchParams.has("type")) {
      searchParams.set("type", "activities");
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }
  }, [location.pathname, navigate, searchParams]);

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
      {page === "products" && touristId && (
  <ProductsPage touristId={touristId} />
)}
      {page === "complaints" && <MyComplaintsPage />}
      {page === "completed-tours" && touristId && ( 
        <CompletedToursPage touristId={touristId} />
      )}  
      {page === "past-activities" && touristId && (
        <PastActivitiesPage touristId={touristId} />
      )}
{page === "products-purchased" && touristId && (
    <PurchasedProductsPage touristId={touristId} />
)}

          {showComplaintForm && (
        <ComplaintForm onClose={() => setShowComplaintForm(false)} />
      )}
    </div>
  );

}
