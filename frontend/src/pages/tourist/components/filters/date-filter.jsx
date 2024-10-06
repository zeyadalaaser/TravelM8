"use client";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";

export function DateFilter() {

    const [date, setDate] = useState();
    return <Card>
        <CardHeader>
            <CardTitle>When?</CardTitle>
        </CardHeader>
        <CardContent>
            <DatePickerWithRange date={date} onSelect={setDate} />
        </CardContent>
    </Card>
}
