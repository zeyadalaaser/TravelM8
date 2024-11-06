"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
    name: string;
    date: Date | undefined;
    onSelect: (date: Date | undefined) => void;
}

export function Date({
    className,
    name,
    date,
    onSelect,
}: DateProps) {

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className="w-[294px] justify-start text-left font-normal space-x-4"
                    >
                        <div className="flex">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span className="text-muted-foreground">
                                {name}
                            </span>
                        </div>
                        <span className={cn("", !date && "text-muted-foreground")}>
                            {date ? format(date, "LLL dd, y") : <span>Pick a date</span>}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[294px] p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="single"
                        selected={date}
                        onSelect={onSelect}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
