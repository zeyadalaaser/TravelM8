import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from "react";
import useRouter from "@/hooks/useRouter";

import { Separator } from "@/components/ui/separator";
import { ClearFilters } from '@/pages/tourist/components/filters/clear-filters';
import { DateFilter } from "@/pages/tourist/components/filters/date-filter";
import { RatingFilter } from "@/pages/tourist/components/filters/rating-filter";
import { PriceFilter } from "@/pages/tourist/components/filters/price-filter";
import { CategoryFilter } from "@/pages/tourist/components/filters/category-filter";
import { SortSelection } from "@/pages/tourist/components/filters/sort-selection";
import { Activities } from "@/pages/tourist/components/activities";
import { SearchBar } from "@/pages/tourist/components/filters/search";
import { getActivities } from "@/pages/tourist/api/apiService";

export function ActivitiesPage() {
    const { location } = useRouter();
    const [activities, setActivities] = useState([]);

    const fetchActivities = useDebouncedCallback(async () => {
        const fetchedActivities = await getActivities(location.search);
        setActivities(fetchedActivities);
    }, 200);

    useEffect(() => {
        fetchActivities();
    }, [location.search]); // Only run when location.search changes

    return <>
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
                <Activities activities={activities} />
            </div>
        </div>
    </>
}