"use client";

import { useEffect, useState } from "react";
import useRouter from "@/hooks/useRouter";
import { DualSlider } from "@/components/ui/dual-slider";

const timeRange = [0, 24];

export function TimeFilter({ name, paramName }) {
    const { searchParams, navigate, location } = useRouter();
    const [range, setRange] = useState(timeRange);

    useEffect(() => {
        const time = searchParams.get(paramName);
        if (time) {
            const [min, max] = time.split("-").map(Number);
            setRange([min, max]);
        } else {
            setRange(timeRange);
        }
    }, [searchParams]);

    const handleSearchParams = (range) => {
        searchParams.set(paramName, `${range[0]}-${range[1]}`);
        if (equalRanges(range, timeRange))
            searchParams.delete(paramName);

        navigate(`${location.pathname}?${searchParams.toString()}`, {
            replace: true,
        });
    };

    const handleSetTime = (range) => {
        if (range[0] === range[1])
            return;
        
        setRange(range);
        handleSearchParams(range);
    };

    const formatTime = (hours) => {
        const roundedHours = Math.floor(hours)
        return `${roundedHours.toString().padStart(2, '0')}:00`
    }

    const equalRanges = (range1, range2) => range1[0] === range2[0] && range1[1] === range2[1];

    return (
        <div className="mt-4">
            <h3 className="font-semibold mb-0">{name}</h3>
            <h3 className="text-sm mb-3">
                {equalRanges(range, timeRange) ? "All Day" : `From ${formatTime(range[0])} to ${formatTime(range[1])}`}
            </h3>
            <DualSlider
                value={range}
                min={timeRange[0]}
                max={timeRange[1]}
                step={1}
                onValueChange={handleSetTime}
            />
            <div className="flex justify-between mt-2">
                <span>00:00</span>
                <span>23:59</span>
            </div>
        </div>
    );
}
