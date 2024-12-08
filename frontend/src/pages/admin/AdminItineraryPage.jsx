import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/NavbarAdmin";
import { getItineraries } from "../tourist/api/apiService";
import AdminItineraryCard from "../../components/ItineraryCard/AdminItineraryCard";
import axios from "axios";

export function AdminItinerariesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({});
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [searchQuery, setSearchQuery] = useState(""); // Added search state

  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    }
    fetchExchangeRates();
  }, []);

  const fetchItineraries = useDebouncedCallback(async () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("isAdmin", true);

    const minPriceUSD = priceRange.min
      ? priceRange.min / (exchangeRates[currency] || 1)
      : "";
    const maxPriceUSD = priceRange.max
      ? priceRange.max / (exchangeRates[currency] || 1)
      : "";

    if (minPriceUSD) queryParams.set("minPrice", minPriceUSD);
    if (maxPriceUSD) queryParams.set("maxPrice", maxPriceUSD);
    queryParams.set("currency", currency);

    try {
      const fetchedItineraries = await getItineraries(
        `?${queryParams.toString()}`
      );
      setItineraries(fetchedItineraries);
      setFilteredItineraries(fetchedItineraries); // Initialize filtered itineraries
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  }, 200);

  useEffect(() => {
    fetchItineraries();
  }, [location.search, currency, priceRange]);

  // Handle search input
  const handleSearch = useDebouncedCallback((query) => {
    setSearchQuery(query);
    const filtered = itineraries.filter((itinerary) =>
      itinerary.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItineraries(filtered);
  }, 300);

  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    setCurrency(selectedCurrency);

    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", selectedCurrency);
    navigate(`${location.pathname}?${queryParams.toString()}`, {
      replace: true,
    });

    fetchItineraries();
  };

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
  };

  const resetFilters = () => {
    setPriceRange({ min: "", max: "" });
    setCurrency("USD");
    setItineraries([]);
    navigate(location.pathname, { replace: true });
    fetchItineraries();
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-8 w-4/5">
        <h1 className="text-3xl font-bold mb-8">Itineraries</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by itinerary name"
            value={searchQuery} // Bind to search query
            onChange={(e) => handleSearch(e.target.value)} // Debounced search
            className="w-1/4 border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
          {filteredItineraries.length > 0 ? (
            <AdminItineraryCard
              itineraries={filteredItineraries} // Use filtered itineraries
              isAdmin={true}
              currency={currency}
              exchangeRate={exchangeRates[currency] || 1}
              onRefresh={fetchItineraries}
            />
          ) : (
            <p className="text-center py-8 bg-gray-100 rounded-lg">
              No itineraries found. Try adjusting your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminItinerariesPage;
