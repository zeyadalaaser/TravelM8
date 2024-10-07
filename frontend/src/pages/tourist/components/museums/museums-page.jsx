import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from "react";
import useRouter from "@/hooks/useRouter";

import { Separator } from "@/components/ui/separator";

import { ClearFilters } from "../filters/clear-filters";
import { PriceFilter } from "../filters/price-filter";
import { SortSelection } from "../filters/sort-selection";
import { SearchBar } from "../filters/search";
import { getMuseums } from "../../api/apiService";
import { TagFilter } from '../filters/tag-filter';
import { Museums } from './museums';

export function MuseumsPage() {
    const { location } = useRouter();
    const [museums, setMuseums] = useState([]);

    const fetchMuseums = useDebouncedCallback(async () => {
        const fetchedMuseums = await getMuseums(location.search);
        setMuseums(fetchedMuseums);
    }, 200);

    useEffect(() => {
        fetchMuseums();
    }, [location.search]);

    const searchCategories = [
        { name: 'Name', value: 'name' },
        { name: 'Tag', value: 'tag' }
    ];

    return <>
        <SearchBar categories={searchCategories} />
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
                <PriceFilter />
                <Separator className="mt-5" />
                <TagFilter />
            </div>
            <div className="w-full md:w-3/4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex h-5 items-center space-x-4 text-sm">
                        <div>{museums.length} results</div>
                        <ClearFilters />
                    </div>
                    <SortSelection />
                </div>
                <Museums museums={museums} />
            </div>
        </div>
    </>
}