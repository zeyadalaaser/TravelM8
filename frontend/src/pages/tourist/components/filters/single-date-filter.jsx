import useRouter from '@/hooks/useRouter';
import { Date as DatePicker } from "@/components/ui/date";

const formatDateToISOString = (date) => {
    if (!date)
        return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export function SingleDateFilter({ className, param, name }) {
    const createDate = (date) => {
        return date ? new Date(date) : null;
    };

    const { searchParams, navigate, location } = useRouter();

    const handleSelectDate = (date) => {
        searchParams.set(param, formatDateToISOString(date));

        if (!date) searchParams.delete(param);

        // Use location.pathname to get the current URL path
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };

    return <DatePicker className={className} name={name} date={createDate(searchParams.get(param))} onSelect={handleSelectDate} />;
}
