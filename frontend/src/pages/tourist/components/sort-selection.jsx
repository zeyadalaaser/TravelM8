import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SortSelection() {
    return <Select defaultValue="featured">
        <SelectTrigger className="w-[180px] !ring-0">
            <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low-high">Price: Low to High</SelectItem>
            <SelectItem value="price-high-low">Price: High to Low</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
        </SelectContent>
    </Select>
}