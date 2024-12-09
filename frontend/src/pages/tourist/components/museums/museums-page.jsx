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
import { useWalkthrough } from '@/contexts/WalkthroughContext';
import { Walkthrough } from '@/components/Walkthrough';
import { WalkthroughButton } from '@/components/WalkthroughButton';
import { useCurrency } from "../../../../hooks/currency-provider";


export function MuseumsPage() {
  const [loading, setLoading] = useState(false);
  const { location } = useRouter();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");
  const { currency, exchangeRate } = useCurrency();
  const [museums, setMuseums] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Adjust how many items per page you want
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(museums.length / itemsPerPage);
  // Paginated activities
  const paginatedPlaces = museums.slice(startIndex, endIndex);
  const { addSteps, clearSteps, currentPage: walkthroughPage } = useWalkthrough();
  useEffect(() => {
    if (walkthroughPage === 'museums') {
      clearSteps();
      addSteps([
        {
          target: '[data-tour="museums-search"]',
          content: 'Use the search bar to find museums by name or tag.',
          disableBeacon: true,
        },
        {
          target: '[data-tour="museums-filters"]',
          content: 'Use these filters to refine your search results.',
          disableBeacon: true,
        },
        {
          target: '[data-tour="museums-list"]',
          content: 'Browse through the list of available museums.',
          disableBeacon: true,
        },
        {
          target: '[data-tour="museums-pagination"]',
          content: 'Navigate through different pages of museums.',
          disableBeacon: true,
        }
      ], 'museums');
    }
  }, [addSteps, clearSteps, walkthroughPage]);

  const fetchMuseums = useDebouncedCallback(async () => {
    setLoading(true);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", currency);
    queryParams.set("exchangeRate", exchangeRate);

    const fetchedMuseums = await getMuseums(`?${queryParams.toString()}`);

    setMuseums(fetchedMuseums);
    setCurrentPage(1);
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
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 sticky top-16 h-full">
          <div data-tour="museums-search">
            <SearchBar categories={searchCategories} />
          </div>
          <Separator className="mt-6" />
          <div data-tour="museums-filters">
            <PriceFilter
              currency={currency}
              exchangeRate={exchangeRate}
            />
            <Separator className="mt-5" />
            <SelectFilter name="Tags" paramName="tag" getOptions={getPlaceTags} />
          </div>
        </div>
        <div className="w-full md:w-3/4" data-tour="museums-list">
          <div className="flex justify-between items-center mb-6">
            <div className="flex h-10 items-center space-x-4 text-sm">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div>{museums.length} results</div>
              )}
              <ClearFilters />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center mt-36">
              <CircularProgress />
            </div>

          ) : (
            <>
              <Museums
                museums={paginatedPlaces}
                currency={currency}
                exchangeRate={exchangeRate}
              />

              <div className="flex justify-center mt-6 space-x-2">
                <div className="flex justify-center mt-6 " data-tour="museums-pagination">
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
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Walkthrough />
    </div>
  );
}