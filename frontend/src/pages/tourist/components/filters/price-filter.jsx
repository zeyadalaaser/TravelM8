"use client";

import { DualSlider } from "@/components/ui/dual-slider";
import { useState } from "react";

const defaultRange = [0, 50000];

export function PriceFilter() {
    const [priceRange, setPriceRange] = useState(defaultRange);
    
    return <div className="mt-4">
        <h3 className="font-semibold mb-2">Price</h3>
        <DualSlider defaultValue={defaultRange} max={defaultRange[1]} step={1} onValueChange={setPriceRange} />
        <div className="flex justify-between mt-2">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
        </div>
    </div>
}