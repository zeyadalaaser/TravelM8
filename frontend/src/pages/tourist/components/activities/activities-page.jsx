import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from "react";
import useRouter from "@/hooks/useRouter";

import { Separator } from "@/components/ui/separator";

import { ClearFilters } from "../filters/clear-filters";
import { DateFilter } from "../filters/date-filter";
import { RatingFilter } from "../filters/rating-filter";
import { PriceFilter } from "../filters/price-filter";
import { CategoryFilter } from "../filters/category-filter";
import { SortSelection } from "../filters/sort-selection";
import { Activities } from "./activities";
import { SearchBar } from "../filters/search";
import { getActivities } from "../../api/apiService";

export function ActivitiesPage() {
    const { location } = useRouter();
    const [activities, setActivities] = useState([]);

    const fetchActivities = useDebouncedCallback(async () => {
        getActivities(location.search).then(setActivities);
    }, 200);

    useEffect(() => {
        fetchActivities();
    }, [location.search]); // Only run when location.search changes


    const searchCategories = [
        { name: 'Name', value: 'name' },
        { name: 'Category', value: 'categoryName' },
        { name: 'Tag', value: 'tag' },
    ];

    return <>
        <SearchBar categories={searchCategories} />
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
                    <div className="flex h-10 items-center space-x-4 text-sm">
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