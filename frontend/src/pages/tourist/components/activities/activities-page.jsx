import { useState, useEffect } from "react";
import axios from "axios";
import useRouter from "@/hooks/useRouter";
import { useDebouncedCallback } from "use-debounce";
import { Separator } from "@/components/ui/separator";
import { ClearFilters } from "../filters/clear-filters";
import { DateFilter } from "../filters/date-filter";
import { RatingFilter } from "../filters/rating-filter";
import { PriceFilter } from "../filters/price-filter";
import { SelectFilter } from "../filters/select-filter";
import { SortSelection } from "../filters/sort-selection";
import Activities from "./activities";
import { SearchBar } from "../filters/search";
import { getActivities, getCategories, createActivityBooking } from "../../api/apiService";
import CircularProgress from '@mui/material/CircularProgress';

export function ActivitiesPage() {
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);
  const { location } = useRouter();
  const searchParams = new URLSearchParams(location.search);
  const currency = searchParams.get('currency') ?? "USD";
  const [activities, setActivities] = useState([]);
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
    setLoading(true); // Set loading to true when starting the fetch
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", currency);
    queryParams.set("exchangeRate", exchangeRates[currency] || 1);

    try {
      const fetchedActivities = (await getActivities(`?${queryParams.toString()}`)).filter(a => a.isBookingOpen);

      setActivities(fetchedActivities);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setLoading(false); // Ensure loading is set to false if there’s an error
    }
  }, 200);

  useEffect(() => {
    fetchActivities();
  }, [location.search, currency]);


  const searchCategories = [
    { name: "Name", value: "name" },
    { name: "Category", value: "categoryName" },
    { name: "Tag", value: "tag" },
  ];

  return (
    <div className="mt-24">
      <SearchBar categories={searchCategories} />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full mt-2 md:w-1/4 sticky top-16 h-full">
          <DateFilter />
          <Separator className="mt-7" />
          <PriceFilter
            currency={currency}
            exchangeRate={exchangeRates[currency] || 1}
          />
          <Separator className="mt-5" />
          <RatingFilter />
          <Separator className="mt-7" />
          <SelectFilter name="Categories" paramName="categoryName" getOptions={getCategories} />
        </div>
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex h-5 items-center space-x-4 text-sm">
              <div>{activities.length} results</div>
              <ClearFilters />
            </div>
            <SortSelection />
          </div>
          {loading ? (
            <div className="flex justify-center items-center mt-36">
              <CircularProgress />
            </div>
          ) : (
            <Activities
              token={token}
              bookActivity={createActivityBooking}
              activities={activities}
              currency={currency}
              exchangeRate={exchangeRates[currency] || 1}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivitiesPage;
