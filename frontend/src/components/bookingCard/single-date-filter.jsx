import useRouter from '@/hooks/useRouter';
import { Date as DatePicker } from "@/components/ui/date";
import { useState } from 'react';

export function SingleDateFilter({ className, name, onDateSelect }) {
    const createDate = (date) => {
        return date ? new Date(date) : null;
    };

    const [selectedDate, setSelectedDate] = useState(null);

    const handleSelectDate = (date) => {
        if (!(date instanceof Date) || isNaN(date)) {
            console.warn("Invalid date selected");
            return;
        }

        setSelectedDate(date);
        if (onDateSelect) {
            onDateSelect(date); 
        }
    };

    return <DatePicker className={className} name={name} date={createDate(selectedDate)} onSelect={handleSelectDate} />;
}
