import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import useRouter from "@/hooks/useRouter";
import { Separator } from "@/components/ui/separator";
import { ClearFilters } from "../filters/clear-filters";
import { RatingFilter } from "../filters/rating-filter";
import { PriceFilter } from "../filters/price-filter";
import { SortSelection } from "../filters/sort-selection";
import Products from "./products";
import { SearchBar } from "../filters/search";
import { getProducts } from "../../api/apiService";

const exchangeRates = {
  USD: 1,
  EGP: 30.24,
  EUR: 0.9,
  GBP: 0.8,
  CAD: 1.25,
  AUD: 1.35,
  JPY: 110,
};

export function ProductsPage({ touristId }) {
  console.log("Tourist ID in ProductsPage:", touristId);
  const { location } = useRouter();
  const [products, setProducts] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchProducts = useDebouncedCallback(async () => {
    setLoading(true); // Start loading
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", currency);
    queryParams.set("exchangeRate", exchangeRates[currency]);

    // Apply price filtering
    if (priceRange.min) queryParams.set("minPrice", priceRange.min);
    if (priceRange.max) queryParams.set("maxPrice", priceRange.max);

    try {
      const products = await getProducts(`?${queryParams.toString()}`);
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  }, 200);

  useEffect(() => {
    fetchProducts();
  }, [location.search, currency, priceRange]);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
  };

  if (loading) return <p>Loading products...</p>; // Loading UI

  return (
    <>
      <SearchBar categories={[{ name: "Name", value: "name" }]} />
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
