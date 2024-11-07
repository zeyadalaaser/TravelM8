import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import useRouter from "@/hooks/useRouter";
import { Separator } from "@/components/ui/separator";
import { ClearFilters } from "../filters/clear-filters";
import { PriceFilter } from "../filters/price-filter";
import { TagFilter } from "../filters/tag-filter";
import { Museums } from "./museums";
import { getMuseums } from "../../api/apiService";
import axios from "axios";

export function MuseumsPage() {
  const { location } = useRouter();
  const [museums, setMuseums] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({});
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // Fetch latest exchange rates on mount
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

  const fetchMuseums = useDebouncedCallback(async () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", currency);
    queryParams.set("exchangeRate", exchangeRates[currency] || 1);

    if (priceRange.min) queryParams.set("minPrice", priceRange.min);
    if (priceRange.max) queryParams.set("maxPrice", priceRange.max);

    const fetchedMuseums = await getMuseums(`?${queryParams.toString()}`);
    setMuseums(fetchedMuseums);
  }, 200);

  useEffect(() => {
    fetchMuseums();
  }, [location.search, currency, priceRange]);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
  };

  return (
    <>
      <div className="flex flex-row justify-between mb-4">
        <label>
          Currency:
          <select value={currency} onChange={handleCurrencyChange}>
            {Object.keys(exchangeRates).map((cur) => (
              <option key={cur} value={cur}>
                {` ${cur}`}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <PriceFilter
            currency={currency}
            exchangeRate={exchangeRates[currency] || 1}
            onPriceChange={handlePriceChange} // This updates price range
          />
          <Separator className="mt-5" />
          <TagFilter />
        </div>
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex h-5 items-center space-x-4 text-sm">
              <div>{museums.length} results</div>
              <ClearFilters />
            </div>
          </div>
          <Museums
            museums={museums}
            currency={currency}
            exchangeRate={exchangeRates[currency] || 1}
          />
        </div>
      </div>
    </>
  );
}
