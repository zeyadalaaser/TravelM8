import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const hotels = [
    { "checkin": "2024-12-19", "checkout": "2024-12-23", "name": "Pyramids Oasis Hotel", "nearby": "Nearby: Great Sphinx of Giza, Great Pyramid of Giza", "location": "Cairo, Egypt", "price": 31, "rating": "7.7", "ratingCount": "379", "ratingCategory": "Good", "ratingStars": 4, "image": "https://content.r9cdn.net/rimg/himg/e0/19/2e/expedia_group-8289936-136705071-902645.jpg?width=552&height=552&xhint=540&yhint=333&crop=true&watermarkheight=28&watermarkpadding=10" },
    { "checkin": "2024-12-15", "checkout": "2024-12-17", "name": "Prime Residence New Cairo", "nearby": "Nearby: City Stars, Cairo International Stadium", "location": "Cairo, Egypt", "price": 74, "rating": "8.5", "ratingCount": "1,012", "ratingCategory": "Excellent", "ratingStars": 0, "image": "https://content.r9cdn.net/rimg/himg/ad/5f/a3/ice-3213088-110173852-908115.jpg?width=552&height=552&xhint=1555&yhint=959&crop=true&watermarkheight=28&watermarkpadding=10" },
    { "checkin": "2024-12-30", "checkout": "2025-01-05", "name": "Renaissance New York Times Square Hotel", "nearby": "Nearby: Times Square, Broadway", "location": "New York, NY, United States", "price": 823, "rating": "8.4", "ratingCount": "1,864", "ratingCategory": "Excellent", "ratingStars": 4, "image": "https://content.r9cdn.net/rimg/himg/3d/d0/18/leonardo-17687-151015874-288411.jpg?width=552&height=552&xhint=1560&yhint=1000&crop=true&watermarkheight=28&watermarkpadding=10" },
    { "checkin": "2024-12-01", "checkout": "2024-12-10", "name": "Marriott's Cypress Harbour Villas", "nearby": "Nearby: Statue of Liberty, Ellis Island", "location": "Orlando, FL, United States", "price": 220, "rating": "9.3", "ratingCount": "614", "ratingCategory": "Excellent", "ratingStars": 4, "image": "https://content.r9cdn.net/rimg/himg/3f/1c/2b/expedia_group-26148-122699674-480513.jpg?width=552&height=552&xhint=540&yhint=333&crop=true&watermarkheight=28&watermarkpadding=10" }
];

export function HotelCard({ hotels, currency, exchangeRate }) {
    return hotels.map((hotel, index) => {
        return (
            <Card key={index} className="bg-inherit border-none shadow-none w-full flex">
                <div className="flex border rounded bg-white p-4 w-full space-x-4">
                    <img src={hotel.image} className="w-[180px] h-[180px] rounded-sm" />
                    <div className="flex flex-col justify-between">
                        <div className="flex flex-col space-y-1">
                            <span className="font-bold text-xl">{hotel.name}</span>
                            <span className="text-xs">{hotel.location}</span>
                            <span className="text-xs">{hotel.nearby}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                        <span className="text-xs">Check in: {hotel.checkin}</span>
                        <span className="text-xs">Check out: {hotel.checkout}</span>
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

                <div className="border rounded bg-white flex flex-col justify-center items-center px-6 py-4 w-[250px]">
                    <div className="flex flex-col items-center">
                        <span className="text-xl font-bold text-center">{(hotel.price * exchangeRate).formatCurrency(currency)}</span>
                        <span className="text-gray-500">per night</span>
                    </div>
                </div>
            </Card>
        )
    });
}