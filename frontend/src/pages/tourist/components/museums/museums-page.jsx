import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import useRouter from "@/hooks/useRouter";
import { Separator } from "@/components/ui/separator";
import { ClearFilters } from "../filters/clear-filters";
import { PriceFilter } from "../filters/price-filter";
import { SelectFilter } from "../filters/select-filter";
import { Museums } from "./museums";
import { getMuseums, getPlaceTags } from "../../api/apiService";
import { SearchBar } from "../filters/search";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@/components/ui/button";

export function MuseumsPage() {
  const [loading, setLoading] = useState(false);
  const { location } = useRouter();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");
  const currency = searchParams.get("currency") ?? "USD";
  const [museums, setMuseums] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Adjust how many items per page you want
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(museums.length / itemsPerPage);
  // Paginated activities
  const paginatedPlaces = museums.slice(startIndex, endIndex);

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
    setLoading(true);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", currency);
    queryParams.set("exchangeRate", exchangeRates[currency] || 1);

    const fetchedMuseums = await getMuseums(`?${queryParams.toString()}`);

    setMuseums(fetchedMuseums);
    setLoading(false);
  }, 200);

  useEffect(() => {
    fetchMuseums();
  }, [location.search, currency]);

  const searchCategories = [
    { name: "Name", value: "name" },
    { name: "Tag", value: "tag" },
  ];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to the top of the page when changing pages
  };
  
  return (
    <div className="mt-24">
      <SearchBar categories={searchCategories} />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 sticky top-16 h-full">
          <PriceFilter
            currency={currency}
            exchangeRate={exchangeRates[currency] || 1}
          />
          <Separator className="mt-5" />
          <SelectFilter name="Tags" paramName="tag" getOptions={getPlaceTags} />
        </div>
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex h-5 items-center space-x-4 text-sm">
              <div>{museums.length} results</div>
              <ClearFilters />
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center mt-36">
              <CircularProgress />
            </div>
          ) : (
            <><Museums
                museums={paginatedPlaces}
                currency={currency}
                exchangeRate={exchangeRates[currency] || 1} /><div className="flex justify-center mt-6 space-x-2">
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
                      } }
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
                </div></>
          )}

        </div>
      </div>
    </div>
  );
}
