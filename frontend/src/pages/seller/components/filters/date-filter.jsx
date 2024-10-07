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
    const createDate = (date) => {
        return date ? new Date(date) : null;
    };

    const { searchParams, navigate, location } = useRouter();

    const handleSelectDate = (date) => {
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
            <DatePickerWithRange
                date={{
                    from: createDate(searchParams.get('startDate')),
                    to: createDate(searchParams.get('endDate'))
                }}
                onSelect={handleSelectDate} />
        </CardContent>
    </Card>
}
