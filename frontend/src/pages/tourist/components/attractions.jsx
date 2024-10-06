import { Clock, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const attractions = [
    {
        title: "New York Explorer Pass: 90+ Things to Do including Edge",
        description: "Book this Go City New York Explorer Pass for top NYC attractions and experiences to save time and money. Once first used, your pass is good for up to 60 days and you can choose from two to ten attractions and/or experi...",
        image: "/placeholder.svg?height=200&width=300",
        price: 84.00,
        rating: 4.5,
        reviews: 1418,
        duration: "1 to 60 days"
    },
    {
        title: "Top of the Rock Observation Deck New York City",
        description: "Get one of the best views in all of New York City from the Top of the Rock Observation Deck at Rockefeller Center. Soak up three indoor and outdoor viewing areas and admire the Big Apple's popular landmarks, such as On...",
        image: "/placeholder.svg?height=200&width=300",
        price: 43.55,
        rating: 4.5,
        reviews: 3642,
        duration: "1 hour",
        cancellation: "Free Cancellation"
    },
    {
        title: "New York CityPASS®",
        description: "Get the New York CityPASS and enjoy great discounts at some of the Big Apple's top attractions. Your CityPASS mobile tickets are valid for nine days from the date of first use and includes admission to The Empire State Building...",
        image: "/placeholder.svg?height=200&width=300",
        price: 146.00,
        rating: 4.5,
        reviews: 2045,
        duration: "9 days"
    },
    {
        title: "Bronx Zoo Admission Ticket",
        description: "Prebook your Bronx Zoo admission ticket for this popular New York City attraction and gain access to the zoo's exhibits and rides on the day you prefer to go. The zoo is celebrating 125 years of its love for animals, making it a...",
        image: "/placeholder.svg?height=200&width=300",
        price: 33.95,
        rating: 4,
        reviews: 371,
        duration: "4 hours",
        cancellation: "Free Cancellation"
    },
    {
        title: "NYC Combo: Statue of Liberty Cruise, St Patrick's Cathedral & MoMa entrance",
        description: "Explore the highlights of New York City with a package that includes a sightseeing bus tour and reserved tickets for the Statue of Liberty ferry. Take the bus tour around Manhattan, then ride the ferry to the Statue of Liberty...",
        image: "/placeholder.svg?height=200&width=300",
        price: 99.00,
        rating: 4,
        reviews: 8,
        duration: "1 day"
    }
];

export function Attractions() {
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
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= Math.floor(attraction.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                        }`}
                                />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">{attraction.reviews} reviews</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{attraction.description}</p>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Clock className="w-4 h-4 mr-1" />
                            {attraction.duration}
                        </div>
                        {attraction.cancellation && (
                            <div className="text-sm text-green-600 mb-2">{attraction.cancellation}</div>
                        )}
                        <div className="text-xl font-bold">from ${attraction.price.toFixed(2)}</div>
                    </div>
                </div>
            </Card>
        ))}
    </div>
}