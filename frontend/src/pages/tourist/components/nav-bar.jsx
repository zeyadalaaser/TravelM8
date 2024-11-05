import { Button } from "@/components/ui/button";
import useRouter from "@/hooks/useRouter";
import { cn } from "@/lib/utils.ts";

const pages = [
    { label: "Activities", value: "activities" },
    { label: "Itineraries", value: "itineraries" },
    { label: "Museums & Historical Places", value: "museums" },
    { label: "Products", value: "products" },
    { label: "Flights", value: "flights" },
    { label: "Hotels", value: "hotels" },
    { label: "View My Complaints", value: "complaints" },
    { label: "Completed Tours", value: "completed-tours" },
];

export function NavBar({onComplaintClick,onRedeemClick}) { // Accept onComplaintClick as a prop
    const { location, searchParams, navigate } = useRouter();
    const currentPage = searchParams.get("type");

    return (
        <div className="flex flex-wrap gap-1.5 mb-4">
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
            {/* Add the Complaint button */}
            <Button
                variant="ghost" // You can change this variant if needed
                className="rounded-full py-2 px-4 border-[1px] border-transparent"
                onClick={onComplaintClick} // Trigger the complaint form
            >
                File a Complaint
            </Button>

            <Button
                variant="ghost"  
                className="rounded-full py-2 px-4 border-[1px] border-transparent"
                onClick={onRedeemClick}  
            >
                Redeem Points
            </Button>
        </div>
    );
}
