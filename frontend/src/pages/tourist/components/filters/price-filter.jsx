"use client";

import { useEffect, useState } from "react";
import useRouter from "@/hooks/useRouter";
import { DualSlider } from "@/components/ui/dual-slider";

const defaultRangeUSD = [0, 4000]; // Default price range in USD

export function PriceFilter({ currency, exchangeRate, onPriceChange }) {
  const { searchParams, navigate, location } = useRouter();
  const [range, setRange] = useState(defaultRangeUSD);

  useEffect(() => {
    const price = searchParams.get("price");
    if (price) {
      const [min, max] = price.split("-").map(Number);
      setRange([min, max]);
    } else {
      setRange(defaultRangeUSD);
    }
  }, [searchParams]);

  const handleSearchParams = (priceRange) => {
    // Convert price range to USD for API query
    const usdRange = priceRange.map((value) =>
      Math.round(value / exchangeRate)
    );
    searchParams.set("price", `${usdRange[0]}-${usdRange[1]}`);
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  const handleSetPrice = (priceRange) => {
    setRange(priceRange.map((value) => Math.round(value / exchangeRate)));
    handleSearchParams(priceRange);
    onPriceChange(priceRange[0], priceRange[1]); // Notify parent of price change
  };

  // Display range in selected currency
  const displayRange = range.map((value) => Math.round(value * exchangeRate));

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Price ({currency})</h3>
      <DualSlider
        value={displayRange}
        min={Math.round(defaultRangeUSD[0] * exchangeRate)}
        max={Math.round(defaultRangeUSD[1] * exchangeRate)}
        step={1}
        onValueChange={handleSetPrice}
      />
      <div className="flex justify-between mt-2">
        <span>
          {currency} {displayRange[0]}
        </span>
        <span>
          {currency} {displayRange[1]}
        </span>
      </div>
    </div>
  );
}
