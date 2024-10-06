import useRouter from '@/hooks/useRouter';
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";

const formatDateToISOString = (date) => {
    if (!date)
        return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export function DateFilter() {
    const { searchParams, navigate, location } = useRouter();

    const [date, setDate] = useState();

    useEffect(() => {
        const from = searchParams.get('startDate');
        const to = searchParams.get('endDate')
        setDate({
            from: from ? new Date(from) : null,
            to: to ? new Date(to) : null,
        });
    }, [searchParams]);

    const handleSelectDate = (date) => {
        setDate(date);

        searchParams.set('startDate', formatDateToISOString(date?.from));
        searchParams.set('endDate', formatDateToISOString(date?.to));

        if (!date?.from) searchParams.delete('startDate');
        if (!date?.to) searchParams.delete('endDate');

        // Use location.pathname to get the current URL path
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };


    return <Card>
        <CardHeader>
            <CardTitle>When?</CardTitle>
        </CardHeader>
        <CardContent>
            <DatePickerWithRange date={date} onSelect={handleSelectDate} />
        </CardContent>
    </Card>
}
