import { Button } from "@/components/ui/button";
import useRouter from "@/hooks/useRouter";

const pages = [
    { label: "Activities", value: "activities" },
    { label: "Itineraries", value: "itineraries" },
    { label: "Museums & Historical Places", value: "museums" },
    { label: "Products", value: "products" },
];

export function NavBar() {
    const { location, searchParams, navigate } = useRouter();
    const currentPage = searchParams.get("type");

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {pages.map((page) => (
                <Button
                    key={page.value}
                    variant={currentPage === page.value ? "outline" : "ghost"}
                    className="rounded-full"
                    onClick={() => {
                        searchParams.set("type", page.value);
                        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
                    }}
                >
                    {page.label}
                </Button>
            ))}
        </div>
    );
}