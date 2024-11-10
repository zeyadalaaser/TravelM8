import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function PriceFilterTwo({ currency, exchangeRate, onPriceChange }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Load min and max from URL on mount and convert if necessary
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const min = params.get("minPrice");
    const max = params.get("maxPrice");
    if (min) setMinPrice(min); // No conversion for display
    if (max) setMaxPrice(max);
  }, [location.search]);

  const handleApplyFilter = () => {
    // Pass values to parent in selected currency without conversion
    onPriceChange(minPrice, maxPrice);

    // Update URL params directly without converting
    const params = new URLSearchParams(location.search);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  return (
    <div className="mt-4 p-4 border rounded-lg shadow-md bg-gray-50">
      <h3 className="font-semibold mb-3 text-lg">Price Filter ({currency})</h3>
      <div className="flex flex-col space-y-3 md:flex-row md:space-x-2">
        <input
          type="number"
          placeholder={`Min ${currency}`}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border rounded-lg p-2 w-full md:w-1/2"
        />
        <input
          type="number"
          placeholder={`Max ${currency}`}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border rounded-lg p-2 w-full md:w-1/2"
        />
        <button
          onClick={handleApplyFilter}
          className="bg-blue-600 text-white rounded-lg p-2 mt-2 md:mt-0 hover:bg-blue-700 transition"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
