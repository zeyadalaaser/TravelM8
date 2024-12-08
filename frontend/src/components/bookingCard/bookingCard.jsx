import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FlightsPage } from "@/components/bookingCard/flights-card.jsx";

function MyTabs() {
  const [value, setValue] = useState("flights");
  const handleChange = (_, newValue) => {
    setValue(newValue);
  };
  const [date, setDate] = useState();


  return (
    <Box sx={{
      width: "100%",
      typography: "body1",
    }}>
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
            <Tab label="Flights" value="flights" />
            <Tab label="Stays" value="stays" />
          </TabList>
        </Box>
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            p: 2,
            borderRadius: "0 0 16px 16px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <TabPanel value="flights">
            <div className="flex mb-4 w-full">
              <FlightsPage />
            </div>
          </TabPanel>


          {/* Stays Tab Content */}
          <TabPanel value="stays">
            <div className="flex mb-4 items-end gap-3 w-full">
              <div className="flex-1">
                <Label htmlFor="destination" className="mb-2 block text-s">Where to?</Label>
                <Input id="destination" placeholder="Enter destination" className="flex-1" />
              </div>
              <div className="flex-1">
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
              <div className="flex-1">
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
              <Button className="rounded-full px-8 text-white ">Search</Button>
            </div>
          </TabPanel>
        </Box>
      </TabContext>
    </Box>

  );
}

export default MyTabs;
