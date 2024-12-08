"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useRef, useState } from "react"


interface ComboboxProps {
    className: string
    data: [{ value: string, label: string, sublabel?: string, image?: any }]
    placeholder: string
    empty: string
    value: string
    onChange?: (value: string) => void
    onSelect?: (value: string) => void
}

export function Combobox({ className, data, placeholder, empty, value, onChange, onSelect }: ComboboxProps) {
    const [open, setOpen] = React.useState(false)

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [buttonWidth, setButtonWidth] = useState("");

    useEffect(() => {
        if (buttonRef.current) {
            setButtonWidth(buttonRef.current.offsetWidth.toString());
        }
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className={cn("relative", className)}>
                    <Button
                        ref={buttonRef}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("w-[294px] justify-normal", className, className && "w-full")}
                    />
                    <div className="w-[90%] flex space-x-2 absolute left-2 top-1/2 transform -translate-y-1/2 text-sm items-center" >
                        <span className="text-muted-foreground">{placeholder}</span>
                        <span className={cn("truncate", !value && "text-muted-foreground")}>
                            {value
                                ? data.find((data) => data.value === value)?.label
                                : empty}
                        </span>
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="p-0" style={{ width: buttonWidth !== null ? `${buttonWidth}px` : 'auto' }}>
                <Command>
                    <CommandInput placeholder={empty} onChangeCapture={(e) => onChange?.(e.currentTarget.value)} />
                    <CommandList>
                        <CommandGroup>
                            {data.map((d) => (
                                <CommandItem
                                    key={d.value}
                                    value={d.value}
                                    onSelect={(currentValue) => {
                                        setOpen(false)
                                        onSelect?.(currentValue)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "h-4 w-4",
                                            value === d.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {d.image}
                                    <div className="flex flex-col max-w-[78%]">
                                        {d.label}
                                        {d.sublabel}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
