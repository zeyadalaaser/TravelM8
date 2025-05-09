import useRouter from '@/hooks/useRouter';
import { Label } from "@/components/ui/label"; 
import { Separator } from "@/components/ui/separator"

export function ClearFilters() {
    const { searchParams, navigate, location } = useRouter();

    const handleClearFilters = () => {
        const newParams = new URLSearchParams();

        if (searchParams.has('sortBy')) {
            newParams.set('sortBy', searchParams.get('sortBy'));
        }
        if (searchParams.has('order')) {
            newParams.set('order', searchParams.get('order'));
        }
        if (searchParams.has('searchBy')) {
            newParams.set('searchBy', searchParams.get('searchBy'));
        }
        if (searchParams.has('type')) {
            newParams.set('type', searchParams.get('type'));
        }
        if (searchParams.has('currency')) {
            newParams.set('currency', searchParams.get('currency'));
        }
        
        navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
    };

    const hasOtherFilters = [...searchParams.keys()].filter(
        (key) => key !== 'sortBy' && key !== 'order' && key !== 'searchBy' && key != 'type' && key != 'currency'
      ).length > 0;

    return (
        <>
            {hasOtherFilters && (
                <>
                    <Separator orientation="vertical" />
                    <Label className="cursor-pointer underline font-normal" onClick={handleClearFilters}>
                        Clear all filters
                    </Label>
                </>
            )}
        </>
    );
}
