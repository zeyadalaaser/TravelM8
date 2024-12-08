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
import {
  getActivities,
  getCategories,
  createActivityBooking,
} from "../../api/apiService";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@/components/ui/button";
import ActivityCard from "./activity-card";

export function ActivitiesPage() {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const { location } = useRouter();
  const searchParams = new URLSearchParams(location.search);
  const currency = searchParams.get("currency") ?? "USD";
  const [activities, setActivities] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4; // Adjust how many items per page you want

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
      const fetchedActivities = (
        await getActivities(`?${queryParams.toString()}`)
      ).filter((a) => a.isBookingOpen);

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

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Paginated activities
  const paginatedActivities = activities.slice(startIndex, endIndex);

  // Total pages
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to the top of the page when changing pages
  };
  return (
    <div className="mt-24">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-grow">
        </div>
        <div className="ml-4 mb-8">
          <SortSelection />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full -mt-16 md:w-1/4 sticky top-16 h-full">
          <SearchBar categories={searchCategories} />
          <Separator className="mb-8" />
          <DateFilter />
          <Separator className="mt-7" />
          <PriceFilter
            currency={currency}
            exchangeRate={exchangeRates[currency] || 1}
          />
          <Separator className="mt-5" />
          <RatingFilter />
          <Separator className="mt-7" />
          <SelectFilter
            name="Categories"
            paramName="categoryName"
            getOptions={getCategories}
          />
        </div>
        <div className="w-full md:w-3/4 -mt-4">
          <div className="flex justify-between items-center mb-24 -mt-3">
            <div className="flex h-5 items-center -mt-8 space-x-4 text-sm">
              {/* <div>{activities.length} results</div> */}
              <ClearFilters />
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center mt-48">
              <CircularProgress />
            </div>
          ) : (
            <div className="-mt-24">
              <div className="space-y-4">
                {paginatedActivities.map((activity) => (
                  <ActivityCard
                    token={token}
                    bookActivity={createActivityBooking}
                    activity={activity}
                    currency={currency}
                    exchangeRate={exchangeRates[currency] || 1} />
                ))}
              </div>
              <div className="flex justify-center mt-6 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scroll(0, 0);
                    }}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div></div>


          )}


        </div>
      </div>
    </div>
  );
}

export default ActivitiesPage;
