import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from "react";
import useRouter from "@/hooks/useRouter";

import { Separator } from "@/components/ui/separator";

import { ClearFilters } from "../filters/clear-filters";
import { RatingFilter } from "../filters/rating-filter";
import { PriceFilter } from "../filters/price-filter";
import { SortSelection } from "../filters/sort-selection";
import { Products } from "./products";
import { SearchBar } from "../filters/search";
import { getProducts } from "../../api/apiService";

export function ProductsPage() {
    const { location } = useRouter();
    const [products, setProducts] = useState([]);

    const fetchProducts = useDebouncedCallback(async () => {
        getProducts(location.search).then(setProducts);
    }, 200);

    useEffect(() => {
        fetchProducts();
    }, [location.search]); // Only run when location.search changes

    const searchCategories = [
        { name: 'Name', value: 'name' }
    ];

    return <>
        <SearchBar categories={searchCategories} />
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
                <PriceFilter />
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
                <Products products={products} />
            </div>
        </div>
    </>
}