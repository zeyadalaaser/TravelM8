import { CircleDollarSign, Clock, MapPin, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/ui/share-button";
import { Fragment } from "react";

export function Museums({ museums, currency, exchangeRate }) {
  return (
    <div className="space-y-4">
      {museums.map((museum, index) => (
        <Card key={index}>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 h-[230px]">
              <img
                src={museum.image}
                alt={museum.name}
                className="w-full h-full"
              />
            </div>
            <div className="w-full md:w-2/3 p-4">
              <div className="flex flex-row justify-between items-center">
                <h3 className="text-xl font-semibold mb-2">{museum.name}</h3>
                <ShareButton id={museum._id} name="place" />
              </div>
              <p className="text-sm text-gray-600 mb-2">{museum.description}</p>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Clock className="w-4 h-4 mr-1" />
                {`${museum.openingHours.open}-${museum.openingHours.close}`}
              </div>
              {museum.tags.length > 0 && <div className="flex items-center flex-wrap gap-2 mb-2">
                <Tag className="w-4 h-4 mr-1" />
                {museum.tags.map((tag, tagIndex) => (
                  <Fragment key={tagIndex}>
                    <Badge variant="secondary">
                      {tag.type}
                    </Badge>
                    <Badge variant="secondary">
                      {tag.historicalPeriod}
                    </Badge>
                  </Fragment>
                ))}
              </div>}
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <Badge variant="secondary">{`Latitude: ${museum.location.lat}`}</Badge>
                <Badge variant="secondary">{`Longitude: ${museum.location.lng}`}</Badge>
              </div>
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <CircleDollarSign className="w-4 h-4 mr-1" />
                {museum.price.map(({ type, price }, index) => (
                  <Badge key={index} variant="secondary">
                    {`${type}: ${Number(price).formatCurrency(currency)}`}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
