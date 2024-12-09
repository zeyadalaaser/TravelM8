import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const flights = [
    {"outbound":{"departure":{"date":"Tue, 10 Dec 2024","time":"19:45","dateTime":"2024-12-10T17:45:00.000Z","carrier":"PD","city":"Toronto","airportId":"YTZ","airportName":"Billy Bishop Toronto City"},"arrival":{"date":"Thu, 12 Dec 2024","time":"16:00","dateTime":"2024-12-12T00:00:00.000Z","carrier":"TO","city":"Hurghada","airportId":"HRG","airportName":"Hurghada International"},"sameDay":false,"duration":"37h 15m","stops":"2 stops"},"inbound":{"departure":{"date":"Wed, 18 Dec 2024","time":"02:05","dateTime":"2024-12-18T00:05:00.000Z","carrier":"MS","city":"Cairo","airportId":"CAI","airportName":"Cairo International"},"arrival":{"date":"Wed, 18 Dec 2024","time":"07:00","dateTime":"2024-12-18T05:00:00.000Z","carrier":"MS","city":"Toronto","airportId":"YYZ","airportName":"Toronto Pearson International"},"sameDay":true,"duration":"11h 55m","stops":"Direct"},"nights":6,"price":1027},
    {"outbound":{"departure":{"date":"Tue, 10 Dec 2024","time":"17:20","dateTime":"2024-12-10T15:20:00.000Z","carrier":"PD","city":"Ottawa","airportId":"YOW","airportName":"Ottawa Macdonald–Cartier International"},"arrival":{"date":"Thu, 12 Dec 2024","time":"16:00","dateTime":"2024-12-12T00:00:00.000Z","carrier":"TO","city":"Hurghada","airportId":"HRG","airportName":"Hurghada International"},"sameDay":false,"duration":"39h 40m","stops":"2 stops"},"inbound":{"departure":{"date":"Wed, 18 Dec 2024","time":"22:05","dateTime":"2024-12-18T20:05:00.000Z","carrier":"J9","city":"Alexandria","airportId":"HBE","airportName":"Borg El Arab"},"arrival":{"date":"Fri, 20 Dec 2024","time":"07:00","dateTime":"2024-12-20T05:00:00.000Z","carrier":"MS","city":"Toronto","airportId":"YYZ","airportName":"Toronto Pearson International"},"sameDay":false,"duration":"39h 55m","stops":"2 stops"},"nights":6,"price":1025},
    {"outbound":{"departure":{"date":"Tue, 10 Dec 2024","time":"00:15","dateTime":"2024-12-09T22:15:00.000Z","carrier":"J9","city":"Kuwait City","airportId":"KWI","airportName":"Kuwait International"},"arrival":{"date":"Tue, 10 Dec 2024","time":"02:15","dateTime":"2024-12-10T00:00:00.000Z","carrier":"J9","city":"Cairo","airportId":"CAI","airportName":"Cairo International"},"sameDay":true,"duration":"3h 0m","stops":"Direct"},"inbound":{"departure":{"date":"Wed, 18 Dec 2024","time":"06:15","dateTime":"2024-12-18T04:15:00.000Z","carrier":"J9","city":"Cairo","airportId":"CAI","airportName":"Cairo International"},"arrival":{"date":"Wed, 18 Dec 2024","time":"09:45","dateTime":"2024-12-18T07:45:00.000Z","carrier":"J9","city":"Kuwait City","airportId":"KWI","airportName":"Kuwait International"},"sameDay":true,"duration":"2h 30m","stops":"Direct"},"nights":8,"price":182}
]

function Trip({ trip, isOutbound }) {
    return (
        <div className="space-y-4">
            <div className="text-gray-600">{trip.departure.date} &nbsp;•&nbsp; {isOutbound ? "Outbound" : "Inbound"}</div>
            <div className="flex flex-col">
                <div className="flex justify-between items-center">
                    <div className="text-2xl w-[55px]">{trip.departure.airportId}</div>
                    <hr className="mx-2 h-0.5 flex-grow border-none bg-gray-200" />
                    <div className="relative flex flex-col items-center space-y-1">
                        <div className="flex space-x-2">
                            <Badge variant="outline" className="px-3 py-2 rounded-full text-sm font-semibold">{trip.stops}</Badge>
                            <img src={`https://images.kiwi.com/airlines/64x64/${trip.departure.carrier}.png?default=airline.png`} alt="Airline logo" className="w-8 h-8 object-contain" />
                        </div>
                        <div className="absolute top-full text-gray-500">{trip.duration}</div>
                    </div>
                    <hr className="mx-2 h-0.5 flex-grow border-none bg-gray-200" />
                    <div className="text-2xl w-[55px] text-end">{trip.arrival.airportId}</div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-lg">{trip.departure.time}</div>
                    <div className="text-lg">{trip.arrival.time}</div>
                </div>
            </div>
        </div>
    );
}

export function FlightCard({ details, currency, exchangeRate }) {
    return (
        <Card className="bg-inherit border-none shadow-none w-full flex">
            <div className="border rounded bg-white p-6 space-y-6 w-full">
                <Trip trip={details.outbound} isOutbound={true} />

                <div className="translate-y-1/2 flex flex-col items-center">
                    <hr class="border-dashed w-full" />
                    <div class="bg-white px-4 py-2 -translate-y-1/2 rounded-full border text-gray-600">
                        {details.nights} nights in {details.outbound.arrival.city}
                    </div>
                </div>
                <Trip trip={details.inbound} isOutbound={false} />
            </div>
            <div className="border rounded bg-white flex flex-col justify-center items-center px-6 py-4 w-[250px]">
                <span className="text-2xl font-bold text-center">{(details.price * exchangeRate).formatCurrency(currency)}</span>
            </div>
        </Card>
    )
}