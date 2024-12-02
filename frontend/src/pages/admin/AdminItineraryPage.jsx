import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { ClearFilters } from "../tourist/components/filters/clear-filters";
import { DateFilter } from "../tourist/components/filters/date-filter";
import { PriceFilterTwo } from "../tourist/components/filters/PriceFilterTwo";
import ItineraryCard from "../../components/ItineraryCard/ItineraryCard";
import { SearchBar } from "../tourist/components/filters/search";
import { getItineraries } from "../tourist/api/apiService";
import { SelectFilter } from "../tourist/components/filters/select-filter";
import { SortSelection } from "../tourist/components/filters/sort-selection";
import Navbar from "@/components/NavbarAdmin";
import axios from "axios";

export function AdminItinerariesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({});
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

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
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  }, 200);

  useEffect(() => {
    fetchItineraries();
  }, [location.search, currency, priceRange]);

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
      <div className="container mx-auto px-4 py-8 mt-8">
        <h1 className="text-3xl font-bold mb-8">Itineraries</h1>
        <div className="mb-6">
          <SearchBar categories={["Name", "Tag"]} />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4 bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Currency:
                <select
                  value={currency}
                  onChange={handleCurrencyChange}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                >
                  {Object.keys(exchangeRates).map((cur) => (
                    <option key={cur} value={cur}>
                      {cur}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <DateFilter />
            <Separator className="my-6" />
            <PriceFilterTwo
              currency={currency}
              exchangeRate={exchangeRates[currency] || 1}
              onPriceChange={handlePriceChange}
            />
            <Separator className="my-6" />
            <SelectFilter
              name="Languages"
              paramName="language"
              getOptions={async () => ["Arabic", "English", "German"]}
            />
          </div>
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4 text-sm">
                <div className="font-medium">{itineraries.length} results</div>
                <ClearFilters onClick={resetFilters} />
              </div>
              <SortSelection />
            </div>
            {itineraries.length > 0 ? (
              <div className="grid gap-6">
                <ItineraryCard
                  itineraries={itineraries}
                  isAdmin={true}
                  currency={currency}
                  exchangeRate={exchangeRates[currency] || 1}
                />
              </div>
            ) : (
              <p className="text-center py-8 bg-gray-100 rounded-lg">
                No itineraries found. Try adjusting your filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminItinerariesPage;
