import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Updated import
import { Separator } from "@/components/ui/separator";
import { ClearFilters } from "../filters/clear-filters";
import { DateFilter } from "../filters/date-filter";
import { PriceFilter } from "../filters/price-filter";
import { SortSelection } from "../filters/sort-selection";
import { Itineraries } from "./itineraries";
import { SearchBar } from "../filters/search";
import { getItineraries } from "../../api/apiService";
import { LanguageFilter } from "./language-filter";

const exchangeRates = {
  USD: 1,
  EGP: 30.24,
  EUR: 0.9,
  GBP: 0.8,
  CAD: 1.25,
  AUD: 1.35,
  JPY: 110,
};

export function ItinerariesPage() {
  const location = useLocation(); // Updated hook
  const [itineraries, setItineraries] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  const fetchItineraries = useDebouncedCallback(async () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", currency);
    queryParams.set("minPrice", priceRange.min || 0);
    queryParams.set("maxPrice", priceRange.max || Infinity);

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
    setCurrency(e.target.value);
  };

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
  };

  const resetFilters = () => {
    setPriceRange({ min: 0, max: 1000 });
    setCurrency("USD");
    setItineraries([]);
    fetchItineraries();
  };

  return (
    <>
      <SearchBar categories={["Name", "Tag"]} />
      <div className="flex justify-between items-center mb-4">
        <label>
          Currency:
          <select value={currency} onChange={handleCurrencyChange}>
            <option value="USD">USD - US Dollar</option>
            <option value="EGP">EGP - Egyptian Pound</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="AUD">AUD - Australian Dollar</option>
            <option value="JPY">JPY - Japanese Yen</option>
          </select>
        </label>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <DateFilter />
          <Separator className="mt-7" />
          <PriceFilter
            currency={currency}
            exchangeRate={exchangeRates[currency]}
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
              exchangeRate={exchangeRates[currency]}
            />
          ) : (
            <p>No itineraries found. Try adjusting your filters.</p>
          )}
        </div>
      </div>
    </>
  );
}
