"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { DateFilter } from "./components/filters/date-filter"
import { RatingFilter } from "./components/filters/rating-filter"
import { PriceFilter } from "./components/filters/price-filter"

import { SortSelection } from "./components/sort-selection"
import { Attractions } from "./components/attractions"
import { SearchBar } from "./components/search"


export default function TouristPage() {
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">TravelM8</h1>
            <div className="flex flex-wrap gap-2 mb-4">
                <Button variant="outline" className="rounded-full">Activities</Button>
                <Button variant="ghost" className="rounded-full">Itineraries</Button>
                <Button variant="ghost" className="rounded-full">Museums & Historical Places</Button>
                <Button variant="ghost" className="rounded-full">Products</Button>
            </div>
            <SearchBar />
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4">
                    <DateFilter />
                    <Separator className="mt-7"/>
                    {/* <TimeFilter />
                    <DurationFilter /> */}
                    <PriceFilter />
                    <Separator className="mt-5"/>
                    <RatingFilter />
                </div>
                <div className="w-full md:w-3/4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex h-5 items-center space-x-4 text-sm">
                            <div>7 results</div>
                            <Separator orientation="vertical" />
                            <Button variant="outline" size="sm">
                                Clear all filters
                            </Button>
                        </div>
                        <SortSelection />
                    </div>
                    <Attractions />
                </div>
            </div>
        </div>
    )
}

