import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from "react";
import useRouter from "@/hooks/useRouter";

import { Separator } from "@/components/ui/separator";

import { ClearFilters } from "../filters/clear-filters";
import { DateFilter } from "../filters/date-filter";
import { PriceFilter } from "../filters/price-filter";
import { SortSelection } from "../filters/sort-selection";
import { Itineraries } from "./itineraries";
import { SearchBar } from "../filters/search";
import { getItineraries } from "../../api/apiService";
import { LanguageFilter } from './language-filter';

export function ItinerariesPage() {
    const { location } = useRouter();
    const [itineraries, setItineraries] = useState([]);

    const fetchItineraries = useDebouncedCallback(async () => {
        getItineraries(location.search).then(setItineraries);
    }, 200);

    useEffect(() => {
        fetchItineraries();
    }, [location.search]); // Only run when location.search changes


    const searchCategories = [
        { name: 'Name', value: 'name' },
        { name: 'Tag', value: 'tag' },
    ];

    return <>
        <SearchBar categories={searchCategories} />
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
                <DateFilter />
                <Separator className="mt-7" />
                <PriceFilter />
                <Separator className="mt-7" />
                <LanguageFilter />
            </div>
            <div className="w-full md:w-3/4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex h-10 items-center space-x-4 text-sm">
                        <div>{itineraries.length} results</div>
                        <ClearFilters />
                    </div>
                    <SortSelection />
                </div>
                <Itineraries itineraries={itineraries} />
            </div>
        </div>
    </>
}