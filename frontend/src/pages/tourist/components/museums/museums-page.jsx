import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import useRouter from "@/hooks/useRouter";
import { Separator } from "@/components/ui/separator";
import { ClearFilters } from "../filters/clear-filters";
import { PriceFilter } from "../filters/price-filter";
import { TagFilter } from "../filters/tag-filter";
import { Museums } from "./museums";
import { getMuseums } from "../../api/apiService";

const exchangeRates = {
  USD: 1,
  EGP: 30.24,
  EUR: 0.9,
  GBP: 0.8,
  CAD: 1.25,
  AUD: 1.35,
  JPY: 110,
};

export function MuseumsPage() {
  const { location } = useRouter();
  const [museums, setMuseums] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const fetchMuseums = useDebouncedCallback(async () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", currency);
    queryParams.set("exchangeRate", exchangeRates[currency]);

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
          <PriceFilter
            currency={currency}
            exchangeRate={exchangeRates[currency]}
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
            exchangeRate={exchangeRates[currency]}
          />
        </div>
      </div>
    </>
  );
}
