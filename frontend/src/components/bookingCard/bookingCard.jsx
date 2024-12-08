import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { MapPin, BedDouble } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import useRouter from "@/hooks/useRouter";
import { FlightsPage } from "@/components/bookingCard/flights-card.jsx";
import { SingleDateFilter } from "../../pages/tourist/components/filters/single-date-filter";
import { CityFilter } from "../../pages/tourist/components/filters/city-filter";
import axios from "axios";

function MyTabs() {
  const [value, setValue] = useState("flights");
  const { navigate, searchParams } = useRouter();

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  function createImage(location) {
    function lucideImage(image) {
      return (
        <div className="flex-shrink-0 !w-[48px] !h-[48px] flex items-center justify-center bg-gray-100 rounded-sm">
          {image}
        </div>
      );
    }
  
    let image;
    if ("destination_images" in location)
      image = (
        <img
          className="flex-shrink-0 w-[48px] h-[48px] rounded-sm"
          src={`${location["destination_images"]["image_jpeg"]}`}
        />
      );
    else if (location["displayType"]["type"] == "hotel")
      image = lucideImage(<BedDouble className="!w-[36px] !h-[27px]" />);
    else image = lucideImage(<MapPin className="!w-[36px] !h-[27px]" />);
  
    return image;
  }

  async function fetchLocations(name) {
    const results = await axios.post(
      `https://www.hotelscombined.com/mvm/smartyv2/search?where=${name}`
    );
    return results["data"].map((location) => {
      const indexId = location.indexId;
      const searchKey = indexId.includes("-") ? indexId.split("-")[1] : indexId;
      return {
        label: (
          <h3 className="truncate text-base font-medium text-gray-900">
            {location.displayname}
          </h3>
        ),
        sublabel: (
          <p className="text-sm text-gray-500">
            {location.displayType.displayName}
          </p>
        ),
        value: `${location.displayname}--${
          location.entityKey.split(":")[0]
        }:${searchKey}`,
        image: createImage(location),
      };
    });
  }

  const onSearch = () => {
    navigate(`tourist-page?type=hotels&${searchParams.toString()}`);
  };

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
                <CityFilter className="flex-1" name="Where" getData={fetchLocations} />
              </div>
              <div className="flex-1">
                <Label htmlFor="check-in" className="mb-2 block text-s">Check in</Label>
                <SingleDateFilter className="flex-1" param="checkin" />

              </div>
              <div className="flex-1">
                <Label htmlFor="check-out" className="mb-2 block text-s">Check out</Label>
                <SingleDateFilter
                  className="flex-1"
                  param="checkout"
                />
              </div>
              <Button className="rounded-full px-8 text-white" onClick={onSearch}>Search</Button>
            </div>
          </TabPanel>
        </Box>
      </TabContext>
    </Box>

  );
}

export default MyTabs;
