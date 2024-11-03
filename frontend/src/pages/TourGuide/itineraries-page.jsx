import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from "react";
import useRouter from "@/hooks/useRouter";
import { Itineraries } from "../../components/ItineraryCard/ItineraryCard";
import { fetchItineraries } from "./api/apiService.js";


export function ItinerariesPage() {
    //const { location } = useRouter();
    const [itineraries, setItineraries] = useState([]);

    const getItineraries = useDebouncedCallback(async () => {
        fetchItineraries().then(setItineraries);
    }, 200);

    useEffect(() => {
        getItineraries();
    }, []); 

    return <>
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-3/4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex h-5 items-center space-x-4 text-sm">
                        <div>{itineraries.length} results</div>
                    </div>
                </div>
                <Itineraries itineraries={itineraries} isTourGuide={true} />
            </div>
        </div>
    </>
}