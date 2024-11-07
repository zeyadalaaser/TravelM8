import React from 'react';

const TourCard = ({ tour }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-lg font-bold">{tour.itinerary?.name}</h3>
      <p className="text-gray-600 mb-2">{tour.itinerary?.description}</p>
      <p className="text-gray-800">
        <strong>Tour Guide:</strong> {tour.tourGuide?.name}
      </p>
    </div>
  );
};

export default TourCard;
