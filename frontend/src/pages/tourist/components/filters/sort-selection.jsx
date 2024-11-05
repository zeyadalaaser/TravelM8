import useRouter from '@/hooks/useRouter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const defaultOptions = [
    { value: "price-asc", description: "Price: Low to High" },
    { value: "price-desc", description: "Price: High to High" },
    { value: "averageRating-desc", description: "Rating" },
];

export function SortSelection({ options }) {

    if (!options)
        options = defaultOptions;

    const { searchParams, navigate, location } = useRouter();

    const handleSort = (value) => {
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

    const getSortBy = () => {
        const sortBy = searchParams.get('sortBy');
        const order = searchParams.get('order');
        return sortBy ? `${sortBy}-${order}` : "featured-?";
    }

    return (
        <Select value={getSortBy()} onValueChange={handleSort}>
            <SelectTrigger className="w-[180px] !ring-0">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="featured-?">Featured</SelectItem>
                {
                    options.map((option, index) => (
                        <SelectItem key={index} value={option.value}>{option.description}</SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    )
}