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


interface ComboboxProps {
    data: [{ value: string, label: string, image?: string }]
    placeholder: string
    empty: string
    value: string
    onChange?: (value: string) => void
    onSelect?: (value: string) => void
}

export function Combobox({ data, placeholder, empty, value, onChange, onSelect }: ComboboxProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[294px] justify-normal space-x-4"
                >
                    <span className="text-muted-foreground">{placeholder}</span>
                    <div>
                        <span className={cn("", !value && "text-muted-foreground")}>
                            {value
                                ? data.find((data) => data.value === value)?.label
                                : empty}
                        </span>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[294px] p-0">
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
                                            "mr-2 h-4 w-4",
                                            value === d.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {d.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
