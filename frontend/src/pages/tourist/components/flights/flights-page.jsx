import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect, useRef } from "react";
import useRouter from "@/hooks/useRouter";

import { ClearFilters } from "../filters/clear-filters";
import { PriceFilter } from "../filters/price-filter";
import { SortSelection } from "../filters/sort-selection";
import { SingleDateFilter } from "../filters/single-date-filter";
import { Flights } from "../flights/flights";
import { getFlights } from "../../api/apiService";
import { CityFilter } from "../filters/city-filter";
import { Button } from "@/components/ui/button";
import { useWalkthrough } from '@/contexts/WalkthroughContext';
import { Walkthrough } from '@/components/Walkthrough';
import { WalkthroughButton } from '@/components/WalkthroughButton';

import axios from "axios";

const query = encodeURIComponent(
  "query UmbrellaPlacesQuery( $search: PlacesSearchInput $filter: PlacesFilterInput $options: PlacesOptionsInput ) { places(search: $search, filter: $filter, options: $options, first: 20) { __typename ... on AppError { error: message } ... on PlaceConnection { edges { rank distance { __typename distance } isAmbiguous node { __typename __isPlace: __typename id legacyId name slug slugEn gps { lat lng } rank ... on City { code autonomousTerritory { legacyId id } subdivision { legacyId name id } country { legacyId name slugEn region { legacyId continent { legacyId id } id } id } airportsCount groundStationsCount } ... on Station { type code gps { lat lng } city { legacyId name slug autonomousTerritory { legacyId id } subdivision { legacyId name id } country { legacyId name region { legacyId continent { legacyId id } id } id } id } } ... on Region { continent { legacyId id } } ... on Country { code region { legacyId continent { legacyId id } id } } ... on AutonomousTerritory { country { legacyId name region { legacyId continent { legacyId id } id } id } } ... on Subdivision { country { legacyId name region { legacyId continent { legacyId id } id } id } } } } } } }"
);
const variables = (cityName) =>
  encodeURIComponent(
    `{"search":{"term":"${cityName}"},"filter":{"onlyTypes":["CITY"]},"options":{"locale":"en"}}`
  );

async function fetchCities(cityName) {
  const results = await fetch(
    `https://api.skypicker.com/umbrella/v2/graphql?featureName=UmbrellaPlacesQuery&query=${query}&variables=${variables(
      cityName
    )}`
  );
  const cities = (await results.json())["data"]["places"]["edges"];

  return cities.map((edge) => {
    const node = edge["node"];

    const label = `${node["name"]}, ${node["country"]["name"]}`;
    const value = `${node["name"]}--${node["legacyId"]}`;
    const imageUrl1 = `https://flagcdn.com/36x27/${node["country"][
      "legacyId"
    ].toLowerCase()}.png`;
    const imageUrl2 = `https://flagcdn.com/72x54/${node["country"][
      "legacyId"
    ].toLowerCase()}.png`;
    const image = (
      <img className="rounded-sm" src={imageUrl1} srcSet={`${imageUrl2} 2x`} />
    );

    return { label, value, image };
  });
}

export function FlightsPage() {
  const { location, searchParams } = useRouter();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const requestCounter = useRef(0);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Adjust how many items per page you want
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(flights.length / itemsPerPage);
  // Paginated activities
  const paginatedFlights = flights.slice(startIndex, endIndex);
  const { addSteps, clearSteps, currentPage: walkthroughPage } = useWalkthrough();

  const fetchFlights = useDebouncedCallback(async () => {
    setLoading(true);

    const currentRequestId = ++requestCounter.current;
    const flights = await getFlights(location.search);

    if (currentRequestId === requestCounter.current) setFlights(flights);

    setLoading(false);
  }, 200);

  useEffect(() => {
    fetchFlights();
  }, [location.search]); // Only run when location.search changes

  const sortOptions = [
    { value: "price-cheapest", description: "Cheapest" },
    { value: "duration-fastest", description: "Fastest" },
  ];

  const currency = searchParams.get("currency") ?? "USD";
  const [exchangeRates, setExchangeRates] = useState({});
  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    }
    fetchExchangeRates();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to the top of the page when changing pages
  };

  useEffect(() => {
    if (walkthroughPage === 'flights') {
      clearSteps();
      addSteps([
      
          {
            target: '[data-tour="flight-search"]',
            content: 'Write departure country.',
            disableBeacon: true,
          },
          {
            target: '[data-tour="flight-filters"]',
            content: 'Write destination country.',
            disableBeacon: true,
          },
          {
            target: '[data-tour="flight-list"]',
            content: 'Select Departure Date.',
            disableBeacon: true,
          },
          {
            target: '[data-tour="flight"]',
            content: 'Select Arrival Date.',
            disableBeacon: true,
          }
       
      ], 'flights');
    }
  }, [addSteps, clearSteps, walkthroughPage]);


  return (
    <>
      <div className="flex justify-between space-x-3" >
        <div className="flex-1" data-tour="flight-search">
        <CityFilter className="flex-1" name="From" getData={fetchCities}   />
        </div>
        <div className="flex-1" data-tour="flight-filters">
       
        <CityFilter className="flex-1" name="To" getData={fetchCities} />
        </div>
        <div className="flex-1" data-tour="flight-list">
        <SingleDateFilter
          className="flex-1"
          name="Departure"
          param="departure"
        />
         </div>
         <div className="flex-1" data-tour="flight">
        <SingleDateFilter className="flex-1" name="Return" param="return" />
        </div>
      </div>
      <div className="mt-6 flex flex-col md:flex-row gap-8">
        <div className="flex w-1/4 h-10 items-center"data-tour="flight-filters">
          {/* <PriceFilter /> */}
        </div>
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex h-10 items-center space-x-4 text-sm">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div>{flights.length} results</div>
              )}
              <ClearFilters />
            </div>
            <SortSelection options={sortOptions} />
          </div>
          {flights.length!==0 ? (

            <><Flights
              flights={paginatedFlights}
              currency={currency}
              exchangeRate={exchangeRates[currency]} />
              <div className="flex justify-center mt-6 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scroll(0, 0);
                    } }
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div></>

          ) : (
            <Flights
            flights={paginatedFlights}
            currency={currency}
            exchangeRate={exchangeRates[currency]} />
          )}

        </div>
        <Walkthrough />
      </div>

    </>
  );
}
