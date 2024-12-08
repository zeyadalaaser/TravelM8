import { Combobox } from "@/components/ui/combobox";
import { useDebouncedCallback } from 'use-debounce';
import { useState } from "react";
import { MapPin } from "lucide-react";

export function CityFilter({ className, name, getData, onCitySelect }) {
    const [data, setData] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);

    const fetchCities = useDebouncedCallback((cityName) => {
        getData(cityName).then(setData);
    }, 200);

    const handleSelectCity = (value) => {

        setSelectedCity(value);
        if (onCitySelect) {
            onCitySelect(value); 
        }
    };

    return <Combobox placeholder={<div className="flex space-x-2 items-center"><MapPin /><span>{name}</span></div>}
        data={data}
        onChange={fetchCities}
        onSelect={handleSelectCity}
        className={className}
        value={selectedCity}
        style={{ minWidth: '300px' }}
    />;
}