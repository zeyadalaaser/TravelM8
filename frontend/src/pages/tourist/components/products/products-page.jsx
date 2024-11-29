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
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({});
  const [token, setToken] = useState(null);

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
      const response = await axios.get(`http://localhost:5001/api/products?${queryParams.toString()}`);
      setTimeout(() => {
        setProducts(response.data.data);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, 200);

  useEffect(() => {
    fetchProducts();
  }, [currency, location.search]);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", e.target.value);
    navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });
  };

  return (
    <div className="mt-24">
      <SearchBar categories={[{ name: "Name", value: "name" }]} />
      <div className="flex flex-row justify-between mb-4">
        <label>
          Currency:
          <select value={currency} onChange={handleCurrencyChange}>
            {Object.keys(exchangeRates).map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <PriceFilter
            currency={currency}
            exchangeRate={exchangeRates[currency] || 1}
          />
          <Separator className="mt-5" />
          <RatingFilter />
        </div>
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex h-5 items-center space-x-4 text-sm">
              <ClearFilters />
            </div>
            <SortSelection />
          </div>
          {loading ? (
            <div className="flex justify-center items-center mt-36">
              <CircularProgress />
            </div>
          ) : (
            <Products
              products={products}
              currency={currency}
              token={token}
              addToCart={addToCart}
            />
          )}
        </div>
      </div>
    </div>
  );
}

