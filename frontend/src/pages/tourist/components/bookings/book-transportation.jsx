import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { BookingToast } from './booking-toast';

const transportOptions = [
    { id: 'uber', name: 'Uber', size: 20, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png' },
    { id: 'didi', name: 'DiDi', size: 20, image: 'https://logodownload.org/wp-content/uploads/2019/08/didi-logo.png' },
    { id: 'indrive', name: 'InDrive', size: 20, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/InDrive_Logo.svg/2560px-InDrive_Logo.svg.png' },
    { id: 'careem', name: 'Careem', size: 20, image: 'https://cdn.worldvectorlogo.com/logos/careem.svg' },
];

export function BookTransportation() {
    const [selectedTransport, setSelectedTransport] = useState('')
    const [fromLocation, setFromLocation] = useState('')
    const [toLocation, setToLocation] = useState('')
    const [date, setDate] = useState()
    const [time, setTime] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleBooking = () => {
        if (!(selectedTransport && fromLocation && toLocation && date && time))
            return;

        const message = `Booking confirmed with ${selectedTransport} from ${fromLocation} to ${toLocation} on ${format(date, 'PP')} at ${time}`;
        BookingToast("transportation", message, false);

        setIsDialogOpen(false)
        setSelectedTransport('');
        setFromLocation('');
        setToLocation('');
        setDate();
        setTime('');
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="rounded-full py-2 px-4 border-[1px] border-transparent">Book Transportation</Button>
            </DialogTrigger>
            <DialogContent className="w-auto">
                <DialogHeader>
                    <DialogTitle>Book Your Ride</DialogTitle>
                    <DialogDescription>
                        Enter your trip details and choose your preferred transportation option.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <Input
                        id="from"
                        value={fromLocation}
                        onChange={(e) => setFromLocation(e.target.value)}
                        placeholder="Enter pickup location"
                    />
                    <Input
                        id="to"
                        value={toLocation}
                        onChange={(e) => setToLocation(e.target.value)}
                        placeholder="Enter destination"
                    />

                    <div className="flex space-x-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Enter pickup date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Input
                            className="w-[170px] block"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                    <RadioGroup value={selectedTransport} onValueChange={setSelectedTransport} className="grid grid-cols-2 gap-4">
                        {transportOptions.map((option) => (
                            <div key={option.id}>
                                <RadioGroupItem value={option.name} id={option.id} className="peer sr-only" />
                                <Label
                                    htmlFor={option.id}
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                                >
                                    <img
                                        src={option.image}
                                        alt={`${option.name} logo`}
                                        className="h-6 object-contain m-1"
                                    />
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleBooking}
                        disabled={!selectedTransport || !fromLocation || !toLocation || !date || !time}
                        className="w-full"
                    >
                        Book Now
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
