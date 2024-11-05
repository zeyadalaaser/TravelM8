function readSegment(sectorSegments, departure) {
    const flight = departure ? "source" : "destination";
    const flightInfo = sectorSegments[departure ? 0 : sectorSegments.length - 1]["segment"];
    const carrier = flightInfo["carrier"]["code"];


    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    const dateTime = new Date(flightInfo[flight]["localTime"]);
    const time = dateTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const date = dateTime.toLocaleDateString('en-GB', options);

    const flightLocation = {
        city: flightInfo[flight]["station"]["city"]["name"],
        airportId: flightInfo[flight]["station"]["legacyId"], // abbreviated airport name
        airportName: flightInfo[flight]["station"]["name"]
    }

    return { date, time, dateTime, carrier, ...flightLocation };
}

function parseTrip(data) {
    const durationSeconds = data["duration"];
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);

    const duration = `${hours}h ${minutes}m`;

    const departure = readSegment(data["sectorSegments"], true);
    const arrival = readSegment(data["sectorSegments"], false);

    return { departure, arrival, sameDay: departure.date === arrival.date, duration };
}

export function itineraryToFlight(itinerary) {
    const inbound = parseTrip(itinerary["inbound"]);
    const outbound = parseTrip(itinerary["outbound"]);

    const nights = (new Date(inbound.departure.dateTime).setUTCHours(0, 0) - outbound.arrival.dateTime.setUTCHours(0, 0)) / 86400000;

    return {
        outbound,
        inbound,
        nights,
        price: itinerary["price"]["amount"]
    };
}