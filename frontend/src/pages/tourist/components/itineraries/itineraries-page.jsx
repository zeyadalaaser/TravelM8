import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { ClearFilters } from "../filters/clear-filters";
import { DateFilter } from "../filters/date-filter";
import { PriceFilterTwo } from "../filters/PriceFilterTwo"; // Updated import for PriceFilterTwo
import { SortSelection } from "../filters/sort-selection";
import { Itineraries } from "./itineraries";
import { SearchBar } from "../filters/search";
import { getItineraries } from "../../api/apiService";
import { LanguageFilter } from "./language-filter";
import axios from "axios";

export function ItinerariesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({});
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // Fetch exchange rates on mount
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

    // Convert prices to USD using exchange rate for server-side filtering
    const minPriceUSD = priceRange.min
      ? priceRange.min / (exchangeRates[currency] || 1)
      : "";
    const maxPriceUSD = priceRange.max
      ? priceRange.max / (exchangeRates[currency] || 1)
      : "";

    // Update queryParams with converted minPrice and maxPrice
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

    // Reset query params with new currency
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", selectedCurrency);
    navigate(`${location.pathname}?${queryParams.toString()}`, {
      replace: true,
    });

    // Trigger a new fetch with the updated currency
    fetchItineraries();
  };

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
  };

  const resetFilters = () => {
    // Reset price range, currency, and itineraries
    setPriceRange({ min: "", max: "" });
    setCurrency("USD");
    setItineraries([]);

    // Remove all query parameters
    navigate(location.pathname, { replace: true });

    // Trigger a new fetch with default filters
    fetchItineraries();
  };

  return (
    <>
      <SearchBar categories={["Name", "Tag"]} />
      <div className="flex justify-between items-center mb-4">
        <label>
          Currency:
          <select value={currency} onChange={handleCurrencyChange}>
            {Object.keys(exchangeRates).map((cur) => (
              <option key={cur} value={cur}>
                {`${cur} - ${cur}`}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <DateFilter />
          <Separator className="mt-7" />
          <PriceFilterTwo
            currency={currency}
            exchangeRate={exchangeRates[currency] || 1}
            onPriceChange={handlePriceChange}
          />
          <Separator className="mt-7" />
          <LanguageFilter />
        </div>
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex h-5 items-center space-x-4 text-sm">
              <div>{itineraries.length} results</div>
              <ClearFilters onClick={resetFilters} />
            </div>
            <SortSelection />
          </div>
          {itineraries.length > 0 ? (
            <Itineraries
              itineraries={itineraries}
              currency={currency}
              exchangeRate={exchangeRates[currency] || 1}
            />
          ) : (
            <p>No itineraries found. Try adjusting your filters.</p>
          )}
        </div>
      </div>
    </>
  );
}
