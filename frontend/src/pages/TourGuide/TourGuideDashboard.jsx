import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";  // Adjust path as per your setup
import { CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import useRouter from "@/hooks/useRouter";
import { cn } from "@/lib/utils.ts"


const pages = [
    { label: "My Itineraries", value: "myItineraries" },
];


export default TourGuideHomeDashboard = () => {
  const navigate = useNavigate();
  const page = searchParams.get("type");

  return (
    <div className="container mx-auto p-4 overflow-y: scroll min-h-[101vh]">
        <h1 className="text-2xl font-bold mb-4">TravelM8</h1>
        <NavBar />
        {page === "myItineraries" && <ItinerariesPage />}

    </div>
  );
};


function NavBar() {
    const { location, searchParams, navigate } = useRouter();
    const currentPage = searchParams.get("type");

    return (
        <div className="flex justify-between">
            <div className="flex flex-wrap gap-2 mb-4">
                {pages.map((page) => (
                    <Button
                        key={page.value}
                        variant={currentPage === page.value ? "outline" : "ghost"}
                        className={cn(
                            "rounded-full py-2 px-4 border-[1px]", // Always apply these classes
                            { 'border-transparent bg-transparent': currentPage !== page.value }
                        )}
                        onClick={() => navigate(`${location.pathname}?type=${page.value}`)}
                    >
                        {page.label}
                    </Button>
                ))}
            </div>
            <CircleUserRound 
                className="cursor-pointer h-10 w-10" 
                onClick={() => navigate('/profileTemplate')}
            />
        </div>
    );
}

