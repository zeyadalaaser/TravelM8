import React, { useState, useEffect } from "react";
import {
  getActivityBookings,
  getItineraryBookings,
} from "../../api/apiService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  ShoppingCart,
  Compass,
  Briefcase,
  Star,
} from "lucide-react";

const BookingHistory = () => {
  const token = localStorage.getItem('token');
  const [allActivitiesList, setAllActivitiesList] = useState([]);
  const [completedActivitiesList, setCompletedActivitiesList] = useState([]);
  const [pendingActivitiesList, setPendingActivitiesList] = useState([]);
  const [cancelledActivitiesList, setCancelledActivitiesList] = useState([]);

  const [allItinerariesList, setAllItinerariesList] = useState([]);
  const [completedItinerariesList, setCompletedItinerariesList] = useState([]);
  const [pendingItinerariesList, setPendingItinerariesList] = useState([]);
  const [cancelledItinerariesList, setCancelledItinerariesList] = useState([]);

  const [allProductsList, setAllProductsList] = useState([]);
//   const [filteredActivitiesList, setFilteredActivitiesList] = useState([]);
  const [items, setItems] = useState([]);
  //////////////////////////////////////////////////////////////////////////
  const [mainTab, setMainTab] = useState("activities");
  const [subTab, setSubTab] = useState("all");

  const [loading, setLoading] = useState(true); // Loading state to track data fetching completion
  const [switchingTabs,setSwitchingTabs] = useState(true);

useEffect(() => {
  const fetchDataAndFilter = async () => {
    try {
      setLoading(true); // Start loading when fetching data
      const activities = await getActivityBookings(token);
      const itineraries = await getItineraryBookings(token);

      // Update main lists
      setAllActivitiesList(activities);
      setAllItinerariesList(itineraries);

      // Filter activities and itineraries after fetching
      const completedActivities = activities.filter(activity => activity.status.toLowerCase() === "completed");
      const pendingActivities = activities.filter(activity => activity.status.toLowerCase() === "booked");
      const cancelledActivities = activities.filter(activity => activity.status.toLowerCase() === "cancelled");

      const completedItineraries = itineraries.filter(itinerary => itinerary.completionStatus.toLowerCase() === "completed");
      const pendingItineraries = itineraries.filter(itinerary => itinerary.completionStatus.toLowerCase() === "pending");
      const cancelledItineraries = itineraries.filter(itinerary => itinerary.completionStatus.toLowerCase() === "cancelled");

      // After data is fetched and filtered, set state in sequence
      setCompletedActivitiesList(completedActivities);
      setPendingActivitiesList(pendingActivities);
      setCancelledActivitiesList(cancelledActivities);

      setCompletedItinerariesList(completedItineraries);
      setPendingItinerariesList(pendingItineraries);
      setCancelledItinerariesList(cancelledItineraries);

      setLoading(false); // End loading once data is fully fetched and processed
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // End loading if there's an error
    }
  };

  fetchDataAndFilter();
}, []); // Runs only once when the component mounts
useEffect(() => {
  if (!loading) {
    setSwitchingTabs(true);
    let updatedItems = [];
    if (mainTab === "activities") {
      switch (subTab) {
        case "all":
          updatedItems = allActivitiesList;
          break;
        case "pending":
          updatedItems = pendingActivitiesList;
          break;
        case "completed":
          updatedItems = completedActivitiesList;
          break;
        case "cancelled":
          updatedItems = cancelledActivitiesList;
          break;
        default:
          updatedItems = [];
      }
    } else if (mainTab === "itineraries") {
      switch (subTab) {
        case "all":
          updatedItems = allItinerariesList;
          break;
        case "pending":
          updatedItems = pendingItinerariesList;
          break;
        case "completed":
          updatedItems = completedItinerariesList;
          break;
        case "cancelled":
          updatedItems = cancelledItinerariesList;
          break;
        default:
          updatedItems = [];
      }
    }
    
    // Update the items state immediately after determining the new value
    setItems(updatedItems);
    setSwitchingTabs(false);

  }
}, [mainTab, subTab, allActivitiesList, pendingActivitiesList, completedActivitiesList, cancelledActivitiesList, allItinerariesList, pendingItinerariesList, completedItinerariesList, cancelledItinerariesList, loading]);



  const renderSubTabs = () => {
  if (mainTab === "products") {
    return (
      <TabsList className="mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="purchased">Purchased</TabsTrigger>
      </TabsList>
    );
  } else {
    return (
      <TabsList className="mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>

      </TabsList>
    );
  }
};

const getIcon = (type) => {
  switch (type) {
    case 'products': return <ShoppingCart className="h-5 w-5" />
    case 'activities': return <Compass className="h-5 w-5" />
    case 'itineraries': return <Briefcase className="h-5 w-5" />
    default: return null
  }
}
  const renderCards = () => {
    return items.map((item, index) => (
      <Card key={index} className="mb-4">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              {getIcon(mainTab)}
              { mainTab === "activities" && (item.activityId.name)}
              { mainTab === "itineraries" && (item.itinerary.name)}

            </span>
          </CardTitle>
          <CardDescription>
            {/* {mainTab === "products" && (
              <span className="flex items-center">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 stroke-yellow-400" />
                {item.rating}/5
              </span>
            )} */}
            {mainTab === "activities" && (
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {item.activityId.date}
              </span>
            )}
            {mainTab === "itineraries" &&(
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {item.itinerary.tourDate}
              </span>
            )}         
            </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold flex items-center">
              <>
              <DollarSign className="h-4 w-4 mr-1" />
                {mainTab === "activities" ? item.activityId.price : item.itinerary.price}
              {/* add product */}
              </>
            </span>
          </div>
          {/* {mainTab === "activities" && (
            <p className="text-sm text-muted-foreground flex items-center">
              <MapPin className="h-4 w-4 mr-1" />{" "}
              {(item.location.lat, item.location.lng)}
            </p>
          )} */}
          {mainTab === "activities" && (
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>status</span>
                <span>{item.status}</span>
              </div>
            </div>
          )}
          {mainTab === "itineraries" && (
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Completion</span>
                <span>{item.completionStatus}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {/* <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">View Details</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{item.name}</DialogTitle>
                <DialogDescription>{item.description}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-semibold">Price:</span>
                  <span className="col-span-3">${item.price.toFixed(2)}</span>
                </div>
                {mainTab === "products" && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-semibold">Rating:</span>
                      <span className="col-span-3 flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-yellow-400 stroke-yellow-400" />
                        {item.rating}/5
                      </span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-semibold">Features:</span>
                      <ul className="col-span-3 list-disc pl-5">
                        {item.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                {mainTab === "activities" && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-semibold">Date:</span>
                      <span className="col-span-3">{item.date}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-semibold">Duration:</span>
                      <span className="col-span-3">{item.duration}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-semibold">Location:</span>
                      <span className="col-span-3">{item.location}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-semibold">Includes:</span>
                      <ul className="col-span-3 list-disc pl-5">
                        {item.includes.map((include, index) => (
                          <li key={index}>{include}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                {mainTab === "itineraries" && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-semibold">Duration:</span>
                      <span className="col-span-3">{item.duration}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-semibold">Destinations:</span>
                      <span className="col-span-3">
                        {item.destinations.join(", ")}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-semibold">Highlights:</span>
                      <ul className="col-span-3 list-disc pl-5">
                        {item.highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-semibold">Completion:</span>
                      <span className="col-span-3">{item.completion}%</span>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">
                  {mainTab === "products"
                    ? item.purchased
                      ? "Write a Review"
                      : "Purchase"
                    : mainTab === "activities"
                    ? "Book Now"
                    : "View Full Itinerary"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
          {/* <Button>
            {mainTab === "products"
              ? item.purchased
                ? "Reorder"
                : "Add to Cart"
              : mainTab === "activities"
              ? "Book Now"
              : "Start Planning"}
          </Button> */}
        </CardFooter>
      </Card>
    ));
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="container mx-auto p-4 bg-background">
      <h1 className="text-3xl font-bold mb-6 text-center">Travel Dashboard</h1>
      <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
        </TabsList>

        <TabsContent value={mainTab}>
          <Tabs value={subTab} onValueChange={setSubTab}>
            {renderSubTabs()}
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!switchingTabs && renderCards()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default BookingHistory;
