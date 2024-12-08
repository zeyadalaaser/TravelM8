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
import { useEffect, useRef, useState } from "react"

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

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [buttonWidth, setButtonWidth] = useState("");

    useEffect(() => {
        if (buttonRef.current) {
            setButtonWidth(buttonRef.current.offsetWidth.toString());
        }
    }, []);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className={cn("relative", className)}>
                    <Button
                        ref={buttonRef}
                        id="date"
                        variant={"outline"}
                        className={cn("w-[294px] justify-start text-left font-normal space-x-4", className, className && "w-full")}
                    />
                    <div className="flex space-x-2 absolute left-2 top-1/2 transform -translate-y-1/2 text-sm items-center">
                        <div className="flex items-center">
                            <CalendarIcon className="mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                {name}
                            </span>
                        </div>
                        <span>
                            {date ? format(date, "LLL dd, y") : <span>Pick a date</span>}
                        </span>
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="p-0"
                style={{
                    width: 'auto',  
                    maxWidth: '100%', 
                    overflow: 'visible', 
                }}
                align="start"
>
                <Calendar
                    initialFocus
                    mode="single"
                    selected={date}
                    onSelect={onSelect}
                    classNames={{
                        months:
                          "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                        month: "space-y-4 w-full flex flex-col",
                        table: "w-full h-full border-collapse space-y-1",
                        head_row: "",
                        row: "w-full mt-2",
                        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      }}
                />
            </PopoverContent>
        </Popover>
    )
}
