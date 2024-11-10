import { useState, useEffect } from "react";
import axios from "axios";
import useRouter from "@/hooks/useRouter";
import { useDebouncedCallback } from "use-debounce";
import { Separator } from "@/components/ui/separator";
import { ClearFilters } from "../filters/clear-filters";
import { DateFilter } from "../filters/date-filter";
import { RatingFilter } from "../filters/rating-filter";
import { PriceFilter } from "../filters/price-filter";
import { CategoryFilter } from "../filters/category-filter";
import { SortSelection } from "../filters/sort-selection";
import Activities from "./activities";
import { SearchBar } from "../filters/search";
import { getActivities } from "../../api/apiService";

export function ActivitiesPage() {
  const { location } = useRouter();
  const [activities, setActivities] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({});
  
  // Fetch the latest exchange rates from the API
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

  const fetchActivities = useDebouncedCallback(async () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", currency);
    queryParams.set("exchangeRate", exchangeRates[currency] || 1);

    const fetchedActivities = (await getActivities(`?${queryParams.toString()}`)).filter(a => a.isBookingOpen);
    setActivities(fetchedActivities);
  }, 200);

  useEffect(() => {
    fetchActivities();
  }, [location.search, currency]);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const searchCategories = [
    { name: "Name", value: "name" },
    { name: "Category", value: "categoryName" },
    { name: "Tag", value: "tag" },
  ];

  return (
    <>
      <SearchBar categories={searchCategories} />
      <div className="flex flex-row justify-between mb-4">
        <label>
          Currency:
          <select value={currency} onChange={handleCurrencyChange}>
            {Object.keys(exchangeRates).map((cur) => (
              <option key={cur} value={cur}>{`${cur}`}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <DateFilter />
          <Separator className="mt-7" />
          <PriceFilter
            currency={currency}
            exchangeRate={exchangeRates[currency] || 1}
          />
          <Separator className="mt-5" />
          <RatingFilter />
          <Separator className="mt-7" />
          <CategoryFilter />
        </div>
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex h-5 items-center space-x-4 text-sm">
              <div>{activities.length} results</div>
              <ClearFilters />
            </div>
            <SortSelection />
          </div>
          <Activities
            activities={activities}
            currency={currency}
            exchangeRate={exchangeRates[currency] || 1}
          />
        </div>
      </div>
    </>
  );
}

export default ActivitiesPage;
