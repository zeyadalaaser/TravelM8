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
  const [allActivitiesList, setAllActivitiesList] = useState([]);
  const [allItinerariesList, setAllItinerariesList] = useState([]);
  const [allProductsList, setAllProductsList] = useState([]);
//   const [filteredActivitiesList, setFilteredActivitiesList] = useState([]);
  const [items, setItems] = useState([]);
  //////////////////////////////////////////////////////////////////////////
  const [mainTab, setMainTab] = useState("activities");
  const [subTab, setSubTab] = useState("all");

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

  useEffect(() => {
    const fetchData = async () => {
      setAllActivitiesList(await getActivityBookings());
      setAllItinerariesList(await getItineraryBookings());
    };

    fetchData();
  }, []);

  useEffect(() => {
    const listByTab = {
        // products: {
        //     all: allProductsList,  // assuming allProductsList is available for 'products'
        //     purchased: purchasedProductsList  // assuming purchasedProductsList is available
        // },
        activities: {
            all: allActivitiesList,
            completed: allActivitiesList.filter(activity => activity.status === "completed"),
            pending: allActivitiesList.filter(activity => activity.status === "booked"),
            cancelled: allActivitiesList.filter(activity => activity.status === "cancelled"),
        },
        itineraries: {
            all: allItinerariesList,
            completed: allItinerariesList.filter(itinerary => itinerary.status === "Completed"),
            pending: allItinerariesList.filter(itinerary => itinerary.status === "Pending"),
            cancelled: allItinerariesList.filter(itinerary => itinerary.status === "Cancelled"),
        },
    };

    const newList = listByTab[mainTab]?.[subTab] || [];
    setItems(newList);

}, [mainTab, subTab]);


  const getIcon = (type) => {
    switch (type) {
      case "products":
        return <ShoppingCart className="h-5 w-5" />;
      case "activities":
        return <Compass className="h-5 w-5" />;
      case "itineraries":
        return <Briefcase className="h-5 w-5" />;
      default:
        return null;
    }
  };


//   const items = {
//     products: [
//       {
//         name: "Hiking Gear Set",
//         price: 299.99,
//         purchased: true,
//         rating: 4.5,
//         description:
//           "Complete set of high-quality hiking gear including backpack, boots, and trekking poles.",
//         features: ["Waterproof", "Lightweight", "Durable"],
//       },
//       {
//         name: "Camping Equipment Bundle",
//         price: 499.99,
//         purchased: false,
//         rating: 4.2,
//         description:
//           "Comprehensive camping bundle with tent, sleeping bags, and portable stove.",
//         features: ["4-Season Tent", "Insulated Sleeping Bags", "Compact Stove"],
//       },
//       {
//         name: "Travel Guide Collection",
//         price: 79.99,
//         purchased: true,
//         rating: 4.8,
//         description:
//           "Set of detailed travel guides covering popular destinations worldwide.",
//         features: ["Up-to-date Information", "Maps Included", "Local Tips"],
//       },
//     ],
//     activities: [
//       {
//         name: "Mountain Hiking Adventure",
//         price: 149.99,
//         date: "2023-08-15",
//         duration: "8 hours",
//         location: "Rocky Mountains",
//         description:
//           "Guided hiking tour through scenic mountain trails with breathtaking views.",
//         includes: [
//           "Professional Guide",
//           "Safety Equipment",
//           "Snacks and Water",
//         ],
//       },
//       {
//         name: "City Tour Experience",
//         price: 89.99,
//         date: "2023-07-22",
//         duration: "4 hours",
//         location: "New York City",
//         description:
//           "Comprehensive tour of iconic city landmarks and hidden gems.",
//         includes: [
//           "Knowledgeable Guide",
//           "Transport Between Sites",
//           "Entry Fees",
//         ],
//       },
//       {
//         name: "Scuba Diving Excursion",
//         price: 199.99,
//         date: "2023-09-05",
//         duration: "6 hours",
//         location: "Great Barrier Reef",
//         description:
//           "Underwater adventure exploring vibrant coral reefs and marine life.",
//         includes: ["Diving Equipment", "Boat Trip", "Underwater Photos"],
//       },
//     ],
//     itineraries: [
//       {
//         name: "Weekend Getaway",
//         price: 599.99,
//         duration: "3 days",
//         destinations: ["Beach Resort", "Mountain Retreat"],
//         completion: 75,
//         description: "Quick escape combining relaxation and adventure.",
//         highlights: [
//           "Beachfront Accommodation",
//           "Hiking Excursion",
//           "Spa Treatment",
//         ],
//       },
//       {
//         name: "European Adventure",
//         price: 2499.99,
//         duration: "14 days",
//         destinations: ["Paris", "Rome", "Barcelona"],
//         completion: 30,
//         description: "Comprehensive tour of Europe's most iconic cities.",
//         highlights: [
//           "Eiffel Tower Visit",
//           "Colosseum Tour",
//           "Sagrada Familia Experience",
//         ],
//       },
//       {
//         name: "Tropical Paradise Tour",
//         price: 1799.99,
//         duration: "10 days",
//         destinations: ["Bali", "Phuket", "Maldives"],
//         completion: 0,
//         description:
//           "Island-hopping adventure in Southeast Asia's most beautiful locations.",
//         highlights: [
//           "Balinese Culture Tour",
//           "Thai Cooking Class",
//           "Maldivian Overwater Bungalow Stay",
//         ],
//       },
//     ],
//   };

  const renderCards = () => {
    return items.map((item, index) => (
      <Card key={index} className="mb-4">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              {getIcon(mainTab)}
              {item.itinerary.name}
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
                {mainTab === "activities" ? item.activityId.price.toFixed(2) : item.itinerary.price.toFixed(2)}
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
            {renderCards()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default BookingHistory;
