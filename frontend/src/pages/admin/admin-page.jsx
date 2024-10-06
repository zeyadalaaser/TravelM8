"use client"

import { Button } from "@/components/ui/button"


export default function AdminPage() {
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">TravelM8</h1>
            <div className="flex flex-wrap gap-2 mb-4">
                <Button variant="outline" className="rounded-full">Activities</Button>
                <Button variant="ghost" className="rounded-full">Itineraries</Button>
                <Button variant="ghost" className="rounded-full">Museums & Historical Places</Button>
                <Button variant="ghost" className="rounded-full">Products</Button>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-3/4">
                    <Attractions />
                </div>
            </div>
        </div>
    )
}

