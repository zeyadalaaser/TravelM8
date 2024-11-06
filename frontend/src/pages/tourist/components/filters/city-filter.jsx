import { Combobox } from "@/components/ui/combobox";

import useRouter from '@/hooks/useRouter';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from "react";

const query = encodeURIComponent("query UmbrellaPlacesQuery( $search: PlacesSearchInput $filter: PlacesFilterInput $options: PlacesOptionsInput ) { places(search: $search, filter: $filter, options: $options, first: 20) { __typename ... on AppError { error: message } ... on PlaceConnection { edges { rank distance { __typename distance } isAmbiguous node { __typename __isPlace: __typename id legacyId name slug slugEn gps { lat lng } rank ... on City { code autonomousTerritory { legacyId id } subdivision { legacyId name id } country { legacyId name slugEn region { legacyId continent { legacyId id } id } id } airportsCount groundStationsCount } ... on Station { type code gps { lat lng } city { legacyId name slug autonomousTerritory { legacyId id } subdivision { legacyId name id } country { legacyId name region { legacyId continent { legacyId id } id } id } id } } ... on Region { continent { legacyId id } } ... on Country { code region { legacyId continent { legacyId id } id } } ... on AutonomousTerritory { country { legacyId name region { legacyId continent { legacyId id } id } id } } ... on Subdivision { country { legacyId name region { legacyId continent { legacyId id } id } id } } } } } } }");
const variables = (cityName) => encodeURIComponent(`{"search":{"term":"${cityName}"},"filter":{"onlyTypes":["CITY"]},"options":{"locale":"en"}}`);

async function getCities(cityName) {
    const results = await fetch(`https://api.skypicker.com/umbrella/v2/graphql?featureName=UmbrellaPlacesQuery&query=${query}&variables=${variables(cityName)}`);
    const cities = (await results.json())["data"]["places"]["edges"];

    return cities.map((edge) => {
        const node = edge["node"];

        const label = `${node["name"]}, ${node["country"]["name"]}`;
        const value = `${node["name"]},${node["legacyId"]}`;
        const image = `https://images.kiwi.com/flags/48x0/flag-${node["country"]["legacyId"].toLowerCase()}.jpg`;

        return { label, value, image };
    });
}

export function CityFilter({ name }) {
    const lowerCaseName = name.toLowerCase();

    const { searchParams, navigate, location } = useRouter();

    const [data, setData] = useState([]);

    const fetchCities = useDebouncedCallback((cityName) => {
        getCities(cityName).then(setData);
    }, 200);

    useEffect(() => {
        const value = searchParams.get(lowerCaseName);
        if (!value)
            return;
        
        fetchCities(value.split(',')[0]);
    }, []);

    const handleSelect = (value) => {
        value ? searchParams.set(lowerCaseName, value) : searchParams.delete(lowerCaseName);
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };

    return <Combobox placeholder={name} 
                     empty="City" 
                     data={data} 
                     onChange={fetchCities} 
                     onSelect={handleSelect}
                     value={searchParams.get(lowerCaseName)}
                      />;
}