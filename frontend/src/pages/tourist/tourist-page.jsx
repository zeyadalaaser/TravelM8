"use client"
import useRouter from "@/hooks/useRouter"
import { useEffect } from "react";
import { ActivitiesPage } from "./components/activities-page";
import { NavBar } from "./components/nav-bar";

export default function TouristPage() {

  const { location, navigate, searchParams } = useRouter();

  // Function to decode JWT and get user role
  function getRoleFromToken(token) {
    const decoded = JSON.parse(atob(token.split(".")[1])); // Decode the token
    return decoded.role; // Get the role from the token
  }

  useEffect(() => {
    // Check if the user has a token
    const token = localStorage.getItem("token");
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
      <NavBar />
      <div classNam="">
        {page === "activities" && <ActivitiesPage />}
      </div>
    </div>
  )
}

