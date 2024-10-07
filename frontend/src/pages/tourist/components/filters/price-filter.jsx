import useRouter from '@/hooks/useRouter';
import { DualSlider } from "@/components/ui/dual-slider";

const defaultRange = [0, 4000];

export function PriceFilter() {
    const { searchParams, navigate, location } = useRouter();

    const handleSearchParams = (priceRange) => {
        searchParams.set('price', `${priceRange[0]}-${priceRange[1]}`);
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };

    const handleSetPrice = (priceRange) => {
        handleSearchParams(priceRange);
    };

    const getPrice = (index) => {
        const price = searchParams.get('price');
        return price ? price.split('-').map(Number)[index] : defaultRange[index];
    }

    return <div className="mt-4">
        <h3 className="font-semibold mb-2">Price</h3>
        <DualSlider
            value={searchParams.get('price')?.split('-')?.map(Number) ?? defaultRange}
            min={defaultRange[0]}
            max={defaultRange[1]}
            step={1}
            onValueChange={handleSetPrice}
        />
        <div className="flex justify-between mt-2">
            <span>${getPrice(0)}</span>
            <span>${getPrice(1)}</span>
        </div>
    </div>
}