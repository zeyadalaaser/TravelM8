import useRouter from '@/hooks/useRouter'; 
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect} from "react";

import { DualSlider } from "@/components/ui/dual-slider";

const defaultRange = [0, 50000];

export function PriceFilter() {
    const { searchParams, navigate, location } = useRouter();

    const [priceRange, setPriceRange] = useState(defaultRange);

    useEffect(() => {
        setPriceRange(searchParams.get('price')?.split('-')?.map(Number) ?? defaultRange); 
    }, [searchParams]);

    const handleSearchParams = useDebouncedCallback((priceRange) => {
        searchParams.set('price', `${priceRange[0]}-${priceRange[1]}`);
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }, 200);

    const handleSetPrice = (priceRange) => {
        setPriceRange(priceRange);
        handleSearchParams(priceRange);
    };

    return <div className="mt-4">
        <h3 className="font-semibold mb-2">Price</h3>
        <DualSlider
            defaultValue={defaultRange}
            value={priceRange}
            min={defaultRange[0]}
            max={defaultRange[1]}
            step={1}
            onValueChange={handleSetPrice}
        />
        <div className="flex justify-between mt-2">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
        </div>
    </div>
}