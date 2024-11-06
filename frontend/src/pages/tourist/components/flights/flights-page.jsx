import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect, useRef } from "react";
import useRouter from "@/hooks/useRouter";

import { ClearFilters } from "../filters/clear-filters";
import { PriceFilter } from "../filters/price-filter";
import { SortSelection } from "../filters/sort-selection";
import { SingleDateFilter } from '../filters/single-date-filter';
import { Flights } from '../flights/flights';
import { getFlights } from "../../api/apiService";
import { CityFilter } from '../filters/city-filter';


export function FlightsPage() {
    const { location } = useRouter();
    const [flights, setFlights] = useState([]);
    const requestCounter = useRef(0);

    const fetchFlights = useDebouncedCallback(async () => {
        const currentRequestId = ++requestCounter.current;
        const flights = await getFlights(location.search);
        
        if (currentRequestId === requestCounter.current)
            setFlights(flights);
    }, 200);

    useEffect(() => {
        fetchFlights();
    }, [location.search]); // Only run when location.search changes

    const sortOptions = [
        { value: 'price-cheapest', description: 'Cheapest' },
        { value: 'duration-fastest', description: 'Fastest' },
    ];

    return <>
        <div className="flex space-x-6">
            <CityFilter name="From" />
            <CityFilter name="To" />
            <SingleDateFilter name="Departure" param="departure" />
            <SingleDateFilter name="Return" param="return" />
        </div>
        <div className="mt-6 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
                <PriceFilter />
            </div>
            <div className="w-full md:w-3/4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex h-10 items-center space-x-4 text-sm">
                        <div>{flights.length} results</div>
                        <ClearFilters />
                    </div>
                    <SortSelection options={sortOptions} />
                </div>
                <Flights flights={flights} />
            </div>
        </div>
    </>
}