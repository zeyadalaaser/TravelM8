import { CircleDollarSign, Clock, MapPin, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


export function Museums({ museums }) {
    return <div className="space-y-4">
        {museums.map((museum, index) => (
            <Card key={index}>
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3">
                        <img src={museum.image} alt={museum.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full md:w-2/3 p-4">
                        <h3 className="text-xl font-semibold mb-2">{museum.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{museum.description}</p>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Clock className="w-4 h-4 mr-1" />
                            {`${museum.openingHours.open}-${museum.openingHours.close}`}
                        </div>
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                            <Tag className="w-4 h-4 mr-1" />
                            <Badge variant="secondary">{`${museum.tags?.type}`}</Badge>
                            <Badge variant="secondary">{`${museum.tags?.historicalPeriod}`}</Badge>
                        </div>
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <Badge variant="secondary">{`Latitude: ${museum.location.lat}`}</Badge>
                            <Badge variant="secondary">{`Longitude: ${museum.location.lng}`}</Badge>
                        </div>
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                            <CircleDollarSign className="w-4 h-4 mr-1" />
                            {museum.price.map(({type, price}, index) => (
                                <Badge key={index} variant="secondary">{`${type}: $${price}`}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        ))}
    </div>
}