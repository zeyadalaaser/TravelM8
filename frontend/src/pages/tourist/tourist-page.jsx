import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { DateFilter } from "./components/filters/date-filter"
import { RatingFilter } from "./components/filters/rating-filter"
import { PriceFilter } from "./components/filters/price-filter"

import { SortSelection } from "./components/sort-selection"
import { Attractions } from "./components/attractions"
import { SearchBar } from "./components/search"
import { ClearFilters } from './components/filters/clear-filters';
import { getActivities } from "./api/apiService"
import useRouter from "@/hooks/useRouter"

const attractions = [
    {
        title: "New York Explorer Pass: 90+ Things to Do including Edge",
        description: "Book this Go City New York Explorer Pass for top NYC attractions and experiences to save time and money. Once first used, your pass is good for up to 60 days and you can choose from two to ten attractions and/or experi...",
        image: "/placeholder.svg?height=200&width=300",
        price: 84.00,
        rating: 4.5,
        reviews: 1418,
        duration: "1 to 60 days"
    },
    {
        title: "Top of the Rock Observation Deck New York City",
        description: "Get one of the best views in all of New York City from the Top of the Rock Observation Deck at Rockefeller Center. Soak up three indoor and outdoor viewing areas and admire the Big Apple's popular landmarks, such as On...",
        image: "/placeholder.svg?height=200&width=300",
        price: 43.55,
        rating: 4.5,
        reviews: 3642,
        duration: "1 hour",
        cancellation: "Free Cancellation"
    },
    {
        title: "New York CityPASS®",
        description: "Get the New York CityPASS and enjoy great discounts at some of the Big Apple's top attractions. Your CityPASS mobile tickets are valid for nine days from the date of first use and includes admission to The Empire State Building...",
        image: "/placeholder.svg?height=200&width=300",
        price: 146.00,
        rating: 4.5,
        reviews: 2045,
        duration: "9 days"
    },
    {
        title: "Bronx Zoo Admission Ticket",
        description: "Prebook your Bronx Zoo admission ticket for this popular New York City attraction and gain access to the zoo's exhibits and rides on the day you prefer to go. The zoo is celebrating 125 years of its love for animals, making it a...",
        image: "/placeholder.svg?height=200&width=300",
        price: 33.95,
        rating: 4,
        reviews: 371,
        duration: "4 hours",
        cancellation: "Free Cancellation"
    },
    {
        title: "NYC Combo: Statue of Liberty Cruise, St Patrick's Cathedral & MoMa entrance",
        description: "Explore the highlights of New York City with a package that includes a sightseeing bus tour and reserved tickets for the Statue of Liberty ferry. Take the bus tour around Manhattan, then ride the ferry to the Statue of Liberty...",
        image: "/placeholder.svg?height=200&width=300",
        price: 99.00,
        rating: 4,
        reviews: 8,
        duration: "1 day"
    }
];

export default function TouristPage() {

    const { location } = useRouter();
    const activities = getActivities(location.search);
    console.log(activities);
    
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
                </div>
                <div className="w-full md:w-3/4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex h-5 items-center space-x-4 text-sm">
                            <div>{attractions.length} results</div>
                            <ClearFilters />
                        </div>
                        <SortSelection />
                    </div>
                    <Attractions attractions={attractions} />
                </div>
            </div>
        </div>
    )
}

