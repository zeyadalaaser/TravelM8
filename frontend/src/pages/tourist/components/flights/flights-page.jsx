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

const query = encodeURIComponent("query UmbrellaPlacesQuery( $search: PlacesSearchInput $filter: PlacesFilterInput $options: PlacesOptionsInput ) { places(search: $search, filter: $filter, options: $options, first: 20) { __typename ... on AppError { error: message } ... on PlaceConnection { edges { rank distance { __typename distance } isAmbiguous node { __typename __isPlace: __typename id legacyId name slug slugEn gps { lat lng } rank ... on City { code autonomousTerritory { legacyId id } subdivision { legacyId name id } country { legacyId name slugEn region { legacyId continent { legacyId id } id } id } airportsCount groundStationsCount } ... on Station { type code gps { lat lng } city { legacyId name slug autonomousTerritory { legacyId id } subdivision { legacyId name id } country { legacyId name region { legacyId continent { legacyId id } id } id } id } } ... on Region { continent { legacyId id } } ... on Country { code region { legacyId continent { legacyId id } id } } ... on AutonomousTerritory { country { legacyId name region { legacyId continent { legacyId id } id } id } } ... on Subdivision { country { legacyId name region { legacyId continent { legacyId id } id } id } } } } } } }");
const variables = (cityName) => encodeURIComponent(`{"search":{"term":"${cityName}"},"filter":{"onlyTypes":["CITY"]},"options":{"locale":"en"}}`);

async function fetchCities(cityName) {
    const results = await fetch(`https://api.skypicker.com/umbrella/v2/graphql?featureName=UmbrellaPlacesQuery&query=${query}&variables=${variables(cityName)}`);
    const cities = (await results.json())["data"]["places"]["edges"];

    return cities.map((edge) => {
        const node = edge["node"];

        const label = `${node["name"]}, ${node["country"]["name"]}`;
        const value = `${node["name"]}--${node["legacyId"]}`;
        const imageUrl1 = `https://flagcdn.com/36x27/${node["country"]["legacyId"].toLowerCase()}.png`;
        const imageUrl2 = `https://flagcdn.com/72x54/${node["country"]["legacyId"].toLowerCase()}.png`
        const image = <img className="rounded-sm" src={imageUrl1} srcSet={`${imageUrl2} 2x`} />;

        return { label, value, image };
    });
}

export function FlightsPage() {
    const { location } = useRouter();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const requestCounter = useRef(0);

    const fetchFlights = useDebouncedCallback(async () => {
        setLoading(true);
        
        const currentRequestId = ++requestCounter.current;
        const flights = await getFlights(location.search);
        
        if (currentRequestId === requestCounter.current)
            setFlights(flights);

        setLoading(false);
    }, 200);

    useEffect(() => {
        fetchFlights();
    }, [location.search]); // Only run when location.search changes

    const sortOptions = [
        { value: 'price-cheapest', description: 'Cheapest' },
        { value: 'duration-fastest', description: 'Fastest' },
    ];

    return <>
        <div className="flex justify-between space-x-6">
            <CityFilter className="flex-1" name="From" getData={fetchCities} />
            <CityFilter className="flex-1" name="To" getData={fetchCities} />
            <SingleDateFilter className="flex-1" name="Departure" param="departure" />
            <SingleDateFilter className="flex-1" name="Return" param="return" />
        </div>
        <div className="mt-6 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
                <PriceFilter />
            </div>
            <div className="w-full md:w-3/4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex h-10 items-center space-x-4 text-sm">
                        {loading ? <div>Loading...</div> : <div>{flights.length} results</div>}
                        <ClearFilters />
                    </div>
                    <SortSelection options={sortOptions} />
                </div>
                <Flights flights={flights} />
            </div>
        </div>
    </>
}