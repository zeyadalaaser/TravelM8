import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// { name, nearby, location, price, rating, ratingCount, ratingCategory, ratingStars, image };
export function Hotels({ hotels }) {
    return hotels.map((hotel, index) => {
        return (
            <Card key={index} className="mb-4 bg-inherit border-none shadow-none w-full flex">
                <div className="flex border rounded bg-white p-4 w-full space-x-4">
                    <img src={hotel.image} className="w-[150px] h-[150px] rounded-sm" />
                    <div className="flex flex-col justify-between">
                        <div className="flex flex-col space-y-1">
                            <span className="font-bold text-xl">{hotel.name}</span>
                            <span className="text-xs">{hotel.location}</span>
                            <span className="text-xs">{hotel.nearby}</span>
                        </div>
                        <div className="flex space-x-2 items-center">
                            <span
                                className={cn("flex w-9 h-8 justify-center items-center bg-green-700 text-white rounded-md",
                                    hotel.rating > 5 && hotel.rating < 7.5 && "bg-gray-300 text-black",
                                    (hotel.rating < 5 || !hotel.rating) && "bg-black")}
                            >
                                {hotel.rating ? hotel.rating : "-"}
                            </span>
                            <span>{hotel.rating ? `${hotel.ratingCategory} (${hotel.ratingCount})` : "No reviews yet"}</span>
                        </div>
                    </div>
                </div>

                <div className="border rounded bg-white flex flex-col justify-between items-center px-6 py-4 min-w-[200px]">
                    <div />
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold">{hotel.price}</span>
                        <span className="text-gray-500">per night</span>
                    </div>
                    <Button className="px-8">
                        Select
                    </Button>
                </div>
            </Card>
        )
    });
}