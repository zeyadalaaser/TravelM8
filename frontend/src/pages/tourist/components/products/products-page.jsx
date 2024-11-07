// ProductsPage.jsx
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { ClearFilters } from "../filters/clear-filters";
import { RatingFilter } from "../filters/rating-filter";
import { PriceFilterTwo } from "../filters/PriceFilterTwo";
import { SortSelection } from "../filters/sort-selection";
import Products from "./products";
import { SearchBar } from "../filters/search";
import { getProducts } from "../../api/apiService";
import axios from "axios";


export function ProductsPage({ touristId }) {
  console.log("Tourist ID in ProductsPage:", touristId);
  //const { location } = useRouter();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currency, setCurrency] = useState("USD");
  //const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [loading, setLoading] = useState(true); // Add loading state
  const [exchangeRates, setExchangeRates] = useState({});
    // Fetch exchange rates on mount
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


  const fetchProducts = useDebouncedCallback(async () => {
    setLoading(true); // Start loading
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", currency);


    // Apply price filtering
    //if (priceRange.min) queryParams.set("minPrice", priceRange.min);
    //if (priceRange.max) queryParams.set("maxPrice", priceRange.max);

    try {
      const fetchedProducts = await getProducts(`?${queryParams.toString()}`);
      console.log("Fetched products:", fetchedProducts); // Log for debugging
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products. Please try again.");
    } finally {
      setLoading(false); // End loading

    }
  }, 200);

  useEffect(() => {
    fetchProducts();
  }, [location.search, currency]);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", e.target.value);
    navigate(`${location.pathname}?${queryParams.toString()}`, {
      replace: true,
    });
  };

  const handlePriceChange = (minPrice, maxPrice) => {
    const queryParams = new URLSearchParams(location.search);
    if (minPrice) queryParams.set("minPrice", minPrice);
    if (maxPrice) queryParams.set("maxPrice", maxPrice);
    navigate(`${location.pathname}?${queryParams.toString()}`, {
      replace: true,
    });
  };

  if (loading) return <p>Loading products...</p>; // Loading UI

  return (
    <>
      <SearchBar categories={[{ name: "Name", value: "name" }]} />
      <div className="flex flex-row justify-between mb-4">
        <label>
          Currency:
          <select value={currency} onChange={handleCurrencyChange}>
            {Object.keys(exchangeRates).map((cur) => (
              <option key={cur} value={cur}>
                {`${cur}`}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <PriceFilterTwo
            currency={currency}
            exchangeRate={exchangeRates[currency] || 1}
            onPriceChange={handlePriceChange}
          />
          <Separator className="mt-5" />
          <RatingFilter />
        </div>
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex h-5 items-center space-x-4 text-sm">
              <div>{products.length} results</div>
              <ClearFilters />
            </div>
            <SortSelection />
          </div>
          <Products
            products={products}
            currency={currency}

            exchangeRate={exchangeRates[currency]}
            touristId={touristId}

          />
        </div>
      </div>
    </>
  );
}
