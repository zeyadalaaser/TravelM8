import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import axios from 'axios';
import { Separator } from "@/components/ui/separator";
import { ClearFilters } from "../filters/clear-filters";
import { RatingFilter } from "../filters/rating-filter";
import { PriceFilter } from "../filters/price-filter";
import { SortSelection } from "../filters/sort-selection";
import Products from "./products";
import { SearchBar } from "../filters/search";
import CircularProgress from '@mui/material/CircularProgress';
import { getProducts } from '../../api/apiService';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { useWalkthrough } from '@/contexts/WalkthroughContext';
import { Walkthrough } from '@/components/Walkthrough';
import { WalkthroughButton } from '@/components/WalkthroughButton';

const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    const now = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp && decodedPayload.exp < now) {
      return null;
    }
    return decodedPayload;
  } catch (e) {
    console.error('Failed to decode token:', e);
    return null;
  }
};

export function ProductsPage({ addToCart }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');
  const currency = searchParams.get('currency') ?? "USD";
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({});
  const [token, setToken] = useState(null);
  const { addSteps, clearSteps, currentPage: walkthroughPage } = useWalkthrough();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust how many items per page you want
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  // Paginated activities
  const paginatedProducts = products.slice(startIndex, endIndex);
  useEffect(() => {
    if (walkthroughPage === 'products') {
      clearSteps();
      addSteps([
        {
          target: '[data-tour="search-bar"]',
          content: 'Use the search bar to find products by name.',
          disableBeacon: true,
        },
        {
          target: '[data-tour="sort-selection"]',
          content: 'Sort products based on different Price or Ratings.',
          disableBeacon: true,
        },
        {
          target: '[data-tour="filters"]',
          content: 'Use these filters to refine your search results.',
          disableBeacon: true,
        },
        {
          target: '[data-tour="Product-list"]',
          content: 'Browse through the list of available Products and add to cart.',
          disableBeacon: true,
        },
        {
          target: '[data-tour="pagination"]',
          content: 'Navigate through different pages of Products.',
          disableBeacon: true,
        },

      ], 'products');
    }
  }, [addSteps, clearSteps, walkthroughPage]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.userId)
        setToken({ token, decodedToken });
    }
  }, []);

  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    }
    fetchExchangeRates();
  }, []);

  const fetchProducts = useDebouncedCallback(async () => {
    setLoading(true);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", currency);

    try {
      setProducts(await getProducts(queryParams.toString()));
      setCurrentPage(1);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, 200);

  useEffect(() => {
    fetchProducts();
  }, [currency, location.search]);

  // const handleCurrencyChange = (e) => {
  //   setCurrency(e.target.value);
  //   const queryParams = new URLSearchParams(location.search);
  //   queryParams.set("currency", e.target.value);
  //   navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });
  // };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to the top of the page when changing pages
  };

  return (
    <div className="mt-24">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 sticky top-16 h-full">
          <div data-tour="search-bar">
            <SearchBar categories={[{ name: "Name", value: "name" }]} />
          </div>
          <div data-tour="sort-selection">
            <Separator className="mt-6" />
            <PriceFilter
              currency={currency}
              exchangeRate={exchangeRates[currency] || 1}
            />
            <Separator className="mt-5" />
            <RatingFilter />
          </div>
        </div>
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex h-5 items-center space-x-4 text-sm">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div>{products.length} results</div>
              )}
              <ClearFilters />

            </div>
            <div className="w-[180px] " data-tour="filters" >
              <SortSelection />
            </div >
          </div>
          <div >
            <div data-tour="Product-list">
              {loading ? (
                <div className="flex justify-center items-center mt-36">
                  <CircularProgress />
                </div>
              ) : (
                <><Products
                  products={paginatedProducts}
                  currency={currency}
                  token={token} /><div className="flex justify-center mt-6 space-x-2">
                    <div className="flex justify-center mt-6 " data-tour="pagination">
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
                    </div></div></>
              )}  </div>

          </div>
        </div>
      </div>
      <Walkthrough />
    </div>
  );
}

