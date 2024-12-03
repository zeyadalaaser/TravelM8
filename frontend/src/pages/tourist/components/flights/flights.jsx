import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { itineraryToFlight } from "./helpers";
import { BookingToast } from "../bookings/booking-toast";

function Trip({ trip, isOutbound }) {
    return (
        <div className="space-y-4">
            <div className="text-gray-600">{trip.departure.date} &nbsp;•&nbsp; {isOutbound ? "Outbound" : "Inbound"}</div>
            <div className="flex flex-col">
                <div className="flex justify-between items-center">
                    <div className="text-2xl">{trip.departure.airportId}</div>
                    <hr className="mx-2 h-0.5 flex-grow border-none bg-gray-200" />
                    <div className="relative flex flex-col items-center space-y-1">
                        <div className="flex space-x-2">
                            <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-full text-sm font-semibold">Direct</div>
                            <img src={`https://images.kiwi.com/airlines/64x64/${trip.departure.carrier}.png?default=airline.png`} alt="Airline logo" className="w-8 h-8 object-contain" />
                        </div>
                        <div className="absolute top-full text-gray-500">{trip.duration}</div>
                    </div>
                    <hr className="mx-2 h-0.5 flex-grow border-none bg-gray-200" />
                    <div className="text-2xl">{trip.arrival.airportId}</div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-lg">{trip.departure.time}</div>
                    <div className="text-lg">{trip.arrival.time}</div>
                </div>
            </div>
        </div>
    );
}

export function Flights({ flights, currency, exchangeRate }) {

    const bookFlight = () => {
        const message = `Flight booked successfully!`;
        BookingToast("flight", message, true);
    }

    return flights.map((flight, index) => {
        const details = itineraryToFlight(flight);
        return (
            <Card key={index} className="mb-4 bg-inherit border-none shadow-none w-full flex">
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

                <div className="border rounded bg-white flex flex-col justify-between items-center px-6 py-4 w-[250px]">
                    <div />
                    <span className="text-2xl font-bold text-center">{(details.price * exchangeRate).formatCurrency(currency)}</span>
                    <Button className="px-8" onClick={bookFlight}>
                        Select
                    </Button>
                </div>
            </Card>
        )
    });
}