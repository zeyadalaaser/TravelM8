import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import RateItinerary from './RateItinerary';
import RateTourGuide from './RateTourGuide';

export const CompletedToursPage = ({ touristId }) => { 
  const [completedTours, setCompletedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [selectedTourGuide, setSelectedTourGuide] = useState(null);

  useEffect(() => {
    const fetchCompletedTours = async () => {
      if (!touristId) {
        console.warn("Tourist ID is not available");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5001/api/bookings/completed/${touristId}`);
        if (Array.isArray(response.data)) {
          setCompletedTours(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setCompletedTours([]);
        }
      } catch (error) {
        console.error('Error fetching completed tours:', error);
        setCompletedTours([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompletedTours();
  }, [touristId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mx-4 mt-3 space-y-2">
      <h2 className="text-xl font-bold mb-4">Completed Tours</h2>
      {completedTours.length === 0 ? (
        <p>No completed tours found.</p>
      ) : (
        <ul>
          {completedTours.map((tour) => (
            <Card key={tour._id} className="p-4 mb-4 flex flex-col md:flex-row">
              {/* Tour Details */}
              <div className="w-full md:w-2/3 p-4">
                <h3 className="text-xl font-semibold mb-2">{tour.itinerary?.name}</h3>
                

                {/* Tour Description */}
                <p className="text-sm text-gray-600 mb-2">
                  {tour.itinerary?.description}
                </p>

                {/* Tour Date */}
                <div className="flex items-center text-sm text-gray-600 mb-2 gap-2">
                  <Clock className="w-4 h-4 mr-1" />
                  {tour.tourDate?.slice(0, 10)} {/* Display tour date */}
                </div>

             

                {/* Tour Price */}
                <div className="text-xl font-bold mb-4">
                  {Array.isArray(tour.itinerary?.price) && tour.itinerary?.price.length > 0
                    ? tour.itinerary.price
                        .map(({ value }) => `${value.formatCurrency(tour.currency)}`)
                        .join(" - ")
                    : `${tour.itinerary?.price?.formatCurrency(tour.currency)}`}
                </div>

                <div className="text-xl font-bold mb-4">
                <Label className="text-m font-semibold text-black">Tour Guide:</Label>
                <span className="ml-2">{tour.tourGuide?.name}</span>
                </div>

                {/* Rating Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => setSelectedItinerary({ id: tour.itinerary._id, type: "Itinerary" })}
                    className="text-sm mt-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                  >
                    Rate Itinerary
                  </Button>

                  <Button
                    onClick={() => setSelectedTourGuide({ id: tour.tourGuide._id, type: "Tour Guide" })}
                    className="text-sm mt-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                  >
                    Rate Tour Guide
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </ul>
      )}

      {/* Modals for Ratings */}
      {selectedItinerary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <button onClick={() => setSelectedItinerary(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">×</button>
            <RateItinerary
              entityId={selectedItinerary.id}
              entityType={selectedItinerary.type}
              touristId={touristId}
              onClose={() => setSelectedItinerary(null)}
            />
          </div>
        </div>
      )}

{selectedTourGuide && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <button onClick={() => setSelectedTourGuide(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">×</button>
      <RateTourGuide
        entityId={selectedTourGuide.id} 
        touristId={touristId}
        onClose={() => setSelectedTourGuide(null)}
      />
    </div>
  </div>
)}

    </div>
  );
};
