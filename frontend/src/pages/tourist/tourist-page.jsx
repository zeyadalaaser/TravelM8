import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { DateFilter } from "./components/filters/date-filter"
import { RatingFilter } from "./components/filters/rating-filter"
import { PriceFilter } from "./components/filters/price-filter"

import { SortSelection } from "./components/filters/sort-selection"
import { Attractions } from "./components/activities"
import { SearchBar } from "./components/filters/search"
import { ClearFilters } from './components/filters/clear-filters';
import { getActivities } from "./api/apiService"
import useRouter from "@/hooks/useRouter"
import { useState, useEffect } from "react"


export default function TouristPage() {

    const { location } = useRouter();
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
          const fetchedActivities = await getActivities(location.search);
          setActivities(fetchedActivities);
          console.log(fetchedActivities);
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

