import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Stars } from "./stars";

export function Attractions({ attractions }) {
    return <div className="space-y-4">
        {attractions.map((attraction, index) => (
            <Card key={index}>
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3">
                        <img src={attraction.image} alt={attraction.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full md:w-2/3 p-4">
                        <h3 className="text-xl font-semibold mb-2">{attraction.title}</h3>
                        <div className="flex items-center mb-2">
                            <Stars rating={attraction.averageRating} />
                            <span className="ml-2 text-sm text-gray-600">{attraction.totalRatings} reviews</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{attraction.description}</p>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Clock className="w-4 h-4 mr-1" />
                            {attraction.date}
                        </div>
                        {attraction.cancellation && (
                            <div className="text-sm text-green-600 mb-2">{attraction.cancellation}</div>
                        )}
                        <div className="text-xl font-bold">
                            {Array.isArray(attraction.price) && attraction.price.length === 2
                                ? `from $${attraction.price[0]}`
                                : `$${attraction.price}`}
                        </div>
                    </div>
                </div>
            </Card>
        ))}
    </div>
}