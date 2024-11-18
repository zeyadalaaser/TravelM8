import { Box, Tab, Tabs } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useState } from "react";
import { Plane, Building2, Car, ArrowRightLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function MyTabs() {
  const [value, setValue] = useState("flights");
  const [flightType, setFlightType] = useState("roundtrip")
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [date, setDate] = useState();

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
    <TabContext value={value}>
      {/* Top Tabs, Centered, Rounded, and Shadowed */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "white",
          display: "flex",
          justifyContent: "center",
          borderRadius: "16px 16px 0 0", // Rounded top corners
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 1.0)", // Add shadow
        }}
      >
        <TabList onChange={handleChange} aria-label="booking tabs">
          <Tab label="Flights" 
          value="flights" />
          <Tab label="Stays" value="stays" />
          <Tab label="Cars" value="cars" />
        </TabList>
      </Box>
  
      {/* Tab Panels, Rounded Corners and Shadowed */}
    <Box
        sx={{
          bgcolor: "white",
          p: 2,
          borderRadius: "0 0 16px 16px", // Rounded bottom corners
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Add shadow
        }}
      >
        {/* Flights Tab Content */}
        <TabPanel value="flights">
            <div className="flex flex-col gap-4 w-full">
                <div className="flex items-end gap-2 w-full">
                <div className="flex-1 min-w-[120px]">
                    <Label htmlFor="leaving-from" className="mb-2 block text-s">From</Label>
                    <Input id="leaving-from" placeholder="City or airport" className="h-9" />
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                    <ArrowRightLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1 min-w-[120px]">
                    <Label htmlFor="going-to" className="mb-2 block text-s">To</Label>
                    <Input id="going-to" placeholder="City or airport" className="h-9" />
                </div>
                <div className="flex-1 min-w-[120px]">
                <Label htmlFor="destination" className="mb-2 block text-s">Departure</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                    >
                        <CalendarIcon className="mr-2 h-6 w-6" />
                        {date ? format(date, "PPP") : "Select date"}
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
                    type="date"
                    value={date ? format(date, "yyyy-MM-dd") : ""}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    className="sr-only"
                />
                </div>
                {flightType === "roundtrip" && (
                    <div className="flex-1 min-w-[120px]">
                <Label htmlFor="destination" className="mb-2 block text-s">Return</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                    >
                        <CalendarIcon className="mr-2 h-6 w-6" />
                        {date ? format(date, "PPP") : "Select date"}
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
                    type="date"
                    value={date ? format(date, "yyyy-MM-dd") : ""}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    className="sr-only"
                />
                    </div>
                )}
                <div className="flex-1 min-w-[120px]">
                    <Label htmlFor="travelers" className="mb-2 block text-s">Travelers</Label>
                    <Select>
                    <SelectTrigger id="travelers" className="h-9">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1 traveler</SelectItem>
                        <SelectItem value="2">2 travelers</SelectItem>
                        <SelectItem value="3">3 travelers</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <Button className="rounded-full px-8 bg-gray-800 hover:bg-gray-700 text-white ">Search</Button>
                </div>

                {/* Radio buttons container below */}
                <div className="flex justify-start gap-4">
                    <RadioGroup defaultValue="roundtrip" className="flex gap-4" onValueChange={setFlightType}>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="roundtrip" id="roundtrip" />
                        <Label htmlFor="roundtrip">Round-trip</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="oneway" id="oneway" />
                        <Label htmlFor="oneway">One-way</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
        </TabPanel>

  
        {/* Stays Tab Content */}
        <TabPanel value="stays">
          <div className="flex items-end gap-2 w-full">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="destination" className="mb-2 block text-s">Where to?</Label>
              <Input id="destination" placeholder="Enter destination" className="h-9" />
            </div>
            <div className="flex-1 min-w-[200px]">
            <Label htmlFor="check-in" className="mb-2 block text-s">Check in</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                    >
                        <CalendarIcon className="mr-2 h-6 w-6" />
                        {date ? format(date, "PPP") : "Select date"}
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
                    type="date"
                    value={date ? format(date, "yyyy-MM-dd") : ""}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    className="sr-only"
                />
            </div>
            <div className="flex-1 min-w-[200px]">
            <Label htmlFor="check-out" className="mb-2 block text-s">Check out</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                    >
                        <CalendarIcon className="mr-2 h-6 w-6" />
                        {date ? format(date, "PPP") : "Select date"}
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
                    type="date"
                    value={date ? format(date, "yyyy-MM-dd") : ""}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    className="sr-only"
                />
            </div>
            <div className="w-[200px]">
              <Label htmlFor="rooms-guests" className="mb-2 block text-s">Rooms & Guests</Label>
              <Select>
                <SelectTrigger id="rooms-guests" className="h-9">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 room, 2 guests</SelectItem>
                  <SelectItem value="2">2 rooms, 4 guests</SelectItem>
                  <SelectItem value="3">3 rooms, 6 guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="rounded-full px-8 bg-gray-800 hover:bg-gray-700 text-white ">Search</Button>
          </div>
        </TabPanel>
  
        {/* Cars Tab Content */}
        <TabPanel value="cars">
          <div className="flex items-end gap-2 w-full">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="pickup-location" className="mb-2 block text-s">Pick-up location</Label>
              <Input id="pickup-location" placeholder="Enter location" className="h-9" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="dropoff-location" className="mb-2 block text-s">Drop-off location</Label>
              <Input id="dropoff-location" placeholder="Same as pick-up" className="h-9" />
            </div>
            <div className="flex-1 min-w-[200px]">
            <Label htmlFor="pick-up" className="mb-2 block text-s">Pick-up date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                    >
                        <CalendarIcon className="mr-2 h-6 w-6" />
                        {date ? format(date, "PPP") : "Select date"}
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
                    type="date"
                    value={date ? format(date, "yyyy-MM-dd") : ""}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    className="sr-only"
                />
            </div>
            <div className="flex-1 min-w-[200px]">
            <Label htmlFor="drop-off" className="mb-2 block text-s">Drop-off date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                    >
                        <CalendarIcon className="mr-2 h-6 w-6" />
                        {date ? format(date, "PPP") : "Select date"}
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
                    type="date"
                    value={date ? format(date, "yyyy-MM-dd") : ""}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    className="sr-only"
                />
            </div>
            <Button className="rounded-full px-8 bg-gray-800 hover:bg-gray-700 text-white ">Search</Button>
          </div>
        </TabPanel>
      </Box>
    </TabContext>
  </Box>
  
  );
}

export default MyTabs;
