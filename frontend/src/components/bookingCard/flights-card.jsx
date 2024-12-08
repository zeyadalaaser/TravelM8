import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect, useRef } from "react";
import useRouter from "@/hooks/useRouter";
import { SingleDateFilter } from "@/components/bookingCard/single-date-filter.jsx";
import { getFlights } from "@/pages/tourist/api/apiService.js";
import { CityFilter } from "@/components/bookingCard/city-filter.jsx";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"

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
    const isCountry = node.__isPlace === "Country";

    const label = isCountry ? node["name"] : `${node["name"]}, ${node["country"]["name"]}`;
    const value = `${node["name"]}--${node["legacyId"]}`;

    const countryCode = isCountry ? node["legacyId"] : node["country"]["legacyId"];

    const imageUrl1 = `https://flagcdn.com/36x27/${countryCode.toLowerCase()}.png`;
    const imageUrl2 = `https://flagcdn.com/72x54/${countryCode.toLowerCase()}.png`;

    const image = (
      <img className="rounded-sm" src={imageUrl1} srcSet={`${imageUrl2} 2x`} />
    );

    return { label, value, image };
  });
}

export function FlightsPage() {
  const { navigate, searchParams } = useRouter();
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [departureCity, setDepartureCity] = useState(null);
  const [arrivalCity, setArrivalCity] = useState(null);

  const formatDateToISOString = (date) => {
    if (!date)
      return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleSearch = () => {

    if (departureDate) {
      searchParams.set("departure", formatDateToISOString(departureDate));
    } else {
      searchParams.delete("departure");
    }
    if (returnDate) {
      searchParams.set("return", formatDateToISOString(returnDate));
    } else {
      searchParams.delete("return");
    }
    if (departureCity) {
      searchParams.set("from", departureCity)
    }
    else {
      searchParams.delete("from");
    }
    if (arrivalCity) {
      searchParams.set("to", arrivalCity)
    }
    else {
      searchParams.delete("to");
    }
    navigate(`tourist-page?type=flights&${searchParams.toString()}`, { replace: true });
  };

  return (
      <div className="flex w-full justify-between space-x-3 items-end">
        <div className="flex-1">
          <Label htmlFor="departureCity" className="mb-2 block text-s">Leaving from </Label>
          <CityFilter className="flex-1" name="From" getData={fetchCities} onCitySelect={setDepartureCity} />
        </div>
        <div className="flex-1">
          <Label htmlFor="arrivalCity" className="mb-2 block text-s">Going to </Label>
          <CityFilter className="flex-1" name="To" getData={fetchCities} onCitySelect={setArrivalCity} />
        </div>
        <div className="flex-1">
          <Label htmlFor="departureDate" className="mb-2 block text-s">Departure date </Label>
          <SingleDateFilter
            className="flex-1"

            onDateSelect={setDepartureDate}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="returnDate" className="mb-2 block text-s">Return date </Label>
          <SingleDateFilter className="flex-1" param="return" onDateSelect={setReturnDate} />
        </div>
        <Button className="rounded-full px-8 mt-5 text-white " onClick={handleSearch}>Search</Button>
      </div>
  );
}
