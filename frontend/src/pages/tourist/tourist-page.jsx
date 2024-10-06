"use client"
import useRouter from "@/hooks/useRouter"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClearFilters } from './components/filters/clear-filters';
import { DateFilter } from "./components/filters/date-filter";
import { RatingFilter } from "./components/filters/rating-filter";
import { PriceFilter } from "./components/filters/price-filter";
import { SortSelection } from "./components/sort-selection";
import { Attractions } from "./components/attractions";
import { SearchBar } from "./components/search";
import { getActivities } from "./api/apiService"



export default function TouristPage() {

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

  // Function to decode JWT and get user role
  function getRoleFromToken(token) {
    const decoded = JSON.parse(atob(token.split(".")[1])); // Decode the token
    return decoded.role; // Get the role from the token
  }


    const { location } = useRouter();
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
          const fetchedActivities = await getActivities(location.search);
          setActivities(fetchedActivities);
        };
    
        fetchActivities();
      }, [location.search]); // Only run when location.search changes

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">TravelM8</h1>
            <div className="flex flex-wrap gap-2 mb-4">
                <Button variant="outline" className="rounded-full">Activities</Button>
                <Button variant="ghost" className="rounded-full">Itineraries</Button>
                <Button variant="ghost" className="rounded-full">Museums & Historical Places</Button>
                <Button variant="ghost" className="rounded-full">Products</Button>
            </div>
            <SearchBar />
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4">
                    <DateFilter />
                    <Separator className="mt-7" />
                    <PriceFilter />
                    <Separator className="mt-5" />
                    <RatingFilter />
                    <Separator className="mt-7" />
                    <CategoryFilter />
                </div>
                <div className="w-full md:w-3/4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex h-5 items-center space-x-4 text-sm">
                            <div>{activities.length} results</div>
                            <ClearFilters />
                        </div>
                        <SortSelection />
                    </div>
                    <Attractions attractions={activities} />
                </div>
            </div>
        </div>
    )
}

