import { Combobox } from "@/components/ui/combobox";

import useRouter from '@/hooks/useRouter';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

export function CityFilter({ className, name, getData }) {
    const lowerCaseName = name.toLowerCase();

    const { searchParams, navigate, location } = useRouter();
    const [data, setData] = useState([]);

    const fetchCities = useDebouncedCallback((cityName) => {
        getData(cityName).then(setData);
    }, 200);

    useEffect(() => {
        const value = searchParams.get(lowerCaseName);
        if (!value)
            return;

        fetchCities(value.split('--')[0]);
    }, []);


    const handleSelect = (value) => {
        value ? searchParams.set(lowerCaseName, value) : searchParams.delete(lowerCaseName);
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };

    return <Combobox placeholder={<div className="flex space-x-2 items-center"><MapPin /><span>{name}</span></div>}
        data={data}
        onChange={fetchCities}
        onSelect={handleSelect}
        className={className}
        value={searchParams.get(lowerCaseName)}
    />;
}