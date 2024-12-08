import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect, useRef } from "react";
import useRouter from "@/hooks/useRouter";
import { MapPin, BedDouble } from "lucide-react";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import { ClearFilters } from "../filters/clear-filters";
import { SortSelection } from "../filters/sort-selection";
import { SingleDateFilter } from "../filters/single-date-filter";
import { CityFilter } from "../filters/city-filter";
import { getHotels, getToken } from "../../api/apiService";
import { Hotels } from "./hotels";
import { Button } from "@/components/ui/button";
import { useWalkthrough } from '@/contexts/WalkthroughContext';
import { Walkthrough } from '@/components/Walkthrough';
import { PriceFilter } from "../filters/price-filter";
import { SelectFilter } from "../filters/select-filter";

function createImage(location) {
  function lucideImage(image) {
    return (
      <div className="flex-shrink-0 !w-[48px] !h-[48px] flex items-center justify-center bg-gray-100 rounded-sm">
        {image}
      </div>
    );
  }

  let image;
  if ("destination_images" in location)
    image = (
      <img
        className="flex-shrink-0 w-[48px] h-[48px] rounded-sm"
        src={`${location["destination_images"]["image_jpeg"]}`}
      />
    );
  else if (location["displayType"]["type"] == "hotel")
    image = lucideImage(<BedDouble className="!w-[36px] !h-[27px]" />);
  else image = lucideImage(<MapPin className="!w-[36px] !h-[27px]" />);

  return image;
}

async function fetchLocations(name) {
  const results = await axios.post(
    `https://www.hotelscombined.com/mvm/smartyv2/search?where=${name}`
  );
  return results["data"].map((location) => {
    const indexId = location.indexId;
    const searchKey = indexId.includes("-") ? indexId.split("-")[1] : indexId;
    return {
      label: (
        <h3 className="truncate text-base font-medium text-gray-900">
          {location.displayname}
        </h3>
      ),
      sublabel: (
        <p className="text-sm text-gray-500">
          {location.displayType.displayName}
        </p>
      ),
      value: `${location.displayname}--${location.entityKey.split(":")[0]
        }:${searchKey}`,
      image: createImage(location),
    };
  });
}

export function HotelsPage() {
  const { location, searchParams } = useRouter();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const requestCounter = useRef(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Adjust how many items per page you want
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(hotels.length / itemsPerPage);
  // Paginated activities
  const paginatedHotels = hotels.slice(startIndex, endIndex);

  const { addSteps, clearSteps, currentPage: walkthroughPage } = useWalkthrough();
  const fetchHotels = useDebouncedCallback(async () => {
    setLoading(true);

    const currentRequestId = ++requestCounter.current;
    const hotels = await getHotels(location.search);

    const mapped = hotels
      .map((hotel) => {
        if (!("providers" in hotel)) return null;

        const name = hotel.localizedHotelName;
        const nearby =
          "Nearby: " + hotel.localizedNearbyLandmarkNames.join(", ");
        const location = hotel.geolocation.localizedCity;
        const price = hotel.providers[0].totalPrice.price;
        const rating = hotel.rating.scoreDisplay;
        const ratingCount = hotel.rating.reviewCountDisplay;
        const ratingCategory = hotel.rating.localizedRatingCategory;
        const ratingStars = hotel.stars;
        const image =
          hotel.images.length != 0
            ? hotel.images[0].thumbnailSrc
            : "https://content.r9cdn.net/res/images/hotels/results/list/hotel-photo-placeholder.jpg";
        return {
          name,
          nearby,
          location,
          price,
          rating,
          ratingCount,
          ratingCategory,
          ratingStars,
          image,
        };
      })
      .filter((item) => item !== null);

    if (currentRequestId === requestCounter.current) setHotels(mapped);

    setLoading(false);
  }, 200);

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    fetchHotels();
  }, [location.search]); // Only run when location.search changes

  const sortOptions = [
    { value: "price-price_a", description: "Price: Low to High" },
    { value: "price-price_b", description: "Price: High to Low" },
    { value: "rating-userrating_b", description: "Rating" },
  ];

  const currency = searchParams.get("currency") ?? "USD";
  const [exchangeRates, setExchangeRates] = useState({});
  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        setExchangeRates(response.data.rates);
        console.log(exchangeRates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    }
    fetchExchangeRates();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to the top of the page when changing pages
  };
  useEffect(() => {
    if (walkthroughPage === 'hotels') {
      clearSteps();
      addSteps([
        {
          target: '[data-tour="search-bar"]',
          content: 'Use the search bar to find activities by name, category, or tag.',
          disableBeacon: true,
        },
        {
          target: '[data-tour="sort-selection"]',
          content: 'Sort activities based on different criteria.',
          disableBeacon: true,
        },
        {
          target: '[data-tour="filters"]',
          content: 'Use these filters to refine your search results.',
          disableBeacon: true,
        },
        {
          target: '[data-tour="activities-list"]',
          content: 'Browse through the list of available activities.',
          disableBeacon: true,
        }


      ], 'hotels');
    }
  }, [addSteps, clearSteps, walkthroughPage]);

  return (
    <>
      <div className="flex justify-between space-x-3">
        <div className="flex-1" data-tour="search-bar">
          <CityFilter className="flex-1" name="Where" getData={fetchLocations} />
        </div>
        <div className="flex-1" data-tour="sort-selection">
          <SingleDateFilter className="flex-1" name="Check in" param="checkin" />
        </div>
        <div className="flex-1" data-tour="filters">
          <SingleDateFilter
            className="flex-1"
            name="Check out"
            param="checkout"
          />
        </div>
      </div>
      <div className="mt-6 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 sticky top-11 h-full">
          <Separator />
          <div data-tour="hotels-filters">
            <PriceFilter
              currency={currency}
              exchangeRate={exchangeRates[currency] || 1}
            />
            <Separator className="mt-5" />
            <SelectFilter name="Review Score" paramName="review" getOptions={async () => ["6+", "7+", "8+", "9+"].reverse()} />
            <Separator className="mt-5" />
            <SelectFilter name="Hotel Class" paramName="class" getOptions={async () => ["2+ stars", "3+ stars", "4+ stars", "5 stars"].reverse()} />
          </div>
        </div>
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex h-10 items-center space-x-4 text-sm">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div>{hotels.length} results</div>
              )}
              <ClearFilters />
            </div>
            <div data-tour="activities-list">
              <SortSelection options={sortOptions} />
            </div>
          </div>
          {hotels.length !== 0 ? (

            <>
              <Hotels
                hotels={paginatedHotels}
                currency={currency}
                exchangeRate={exchangeRates[currency]} />
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
              </div></>

          ) : (
            <Hotels
              hotels={paginatedHotels}
              currency={currency}
              exchangeRate={exchangeRates[currency]} />)}

        </div>

      </div>
      <Walkthrough />
    </>
  );
}
