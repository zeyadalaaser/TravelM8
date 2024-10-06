import useRouter from '@/hooks/useRouter'; 
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SortSelection() {

    const { searchParams, navigate, location } = useRouter();
    const [selected, setSelected] = useState('featured-?');

    useEffect(() => {
        const sortBy = searchParams.get('sortBy');
        const order = searchParams.get('order');

        if (sortBy)
            setSelected(`${sortBy}-${order}`);

    }, [searchParams]);

    const handleSort = (value) => {
        setSelected(value);
        const [sortBy, order] = value.split('-');

        if (sortBy === 'featured') {
            searchParams.delete('sortBy');
            searchParams.delete('order');
        }
        else {
            searchParams.set('sortBy', sortBy);
            searchParams.set('order', order);
        }

        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };

    return <Select value={selected} onValueChange={handleSort}>
        <SelectTrigger className="w-[180px] !ring-0">
            <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="featured-?">Featured</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="averageRating-desc">Rating</SelectItem>
        </SelectContent>
    </Select>
}