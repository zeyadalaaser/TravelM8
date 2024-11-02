import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import useRouter from "@/hooks/useRouter";
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

const exchangeRates = {
  USD: 1,
  EGP: 30.24,
  EUR: 0.9,
  GBP: 0.8,
  CAD: 1.25,
  AUD: 1.35,
  JPY: 110,
};

export function ActivitiesPage() {
  const { location } = useRouter();
  const [activities, setActivities] = useState([]);
  const [currency, setCurrency] = useState("USD");

  const fetchActivities = useDebouncedCallback(async () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", currency);
    queryParams.set("exchangeRate", exchangeRates[currency]);
    const activities = await getActivities(`?${queryParams.toString()}`);
    setActivities(activities);
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
          Currency:{" "}
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
            exchangeRate={exchangeRates[currency]}
          />
        </div>
      </div>
    </>
  );
}
