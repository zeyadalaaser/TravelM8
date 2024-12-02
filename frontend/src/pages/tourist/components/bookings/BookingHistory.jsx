import React, { useState, useEffect } from "react";
import {
  getActivityBookings,
  getItineraryBookings,
  cancelActivityBooking,
  cancelItineraryBooking
} from "../../api/apiService";

// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  DollarSignIcon,
  ClockIcon,
  TagIcon,
  PercentIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
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
  const token = localStorage.getItem("token");
  const [allActivitiesList, setAllActivitiesList] = useState([]);
  const [completedActivitiesList, setCompletedActivitiesList] = useState([]);
  const [pendingActivitiesList, setPendingActivitiesList] = useState([]);
  const [cancelledActivitiesList, setCancelledActivitiesList] = useState([]);

  const [allItinerariesList, setAllItinerariesList] = useState([]);
  const [completedItinerariesList, setCompletedItinerariesList] = useState([]);
  const [pendingItinerariesList, setPendingItinerariesList] = useState([]);
  const [cancelledItinerariesList, setCancelledItinerariesList] = useState([]);

  const [allProductsList, setAllProductsList] = useState([]);

  const [showingItineraries, setShowingItineraries] = useState([]);
  const [showingActivities, setShowingActivities] = useState([]);

  //////////////////////////////////////////////////////////////////////////
  const [mainTab, setMainTab] = useState("activities");
  const [subTab, setSubTab] = useState("all");

  const [loading, setLoading] = useState(true); // Loading state to track data fetching completion

  const fetchDataAndFilter = async () => {
    try {
      setLoading(true); // Start loading

      const activitiesResponse = await getActivityBookings();
      console.log("Activities Response:", activitiesResponse);

      const itinerariesResponse = await getItineraryBookings();
      console.log("Itineraries Response:", itinerariesResponse);

      // Set state for main lists
      if (activitiesResponse && itinerariesResponse) {
        setAllActivitiesList(activitiesResponse);
        setAllItinerariesList(itinerariesResponse);
        setShowingActivities(activitiesResponse);
        setShowingItineraries(itinerariesResponse);

        console.log("Activities Set State:", activitiesResponse);
        console.log("Itineraries Set State:", itinerariesResponse);

        // Filter activities and itineraries after fetching
        const completedActivities = activitiesResponse.filter(
          (activity) => activity.status?.toLowerCase() === "completed"
        );
        const pendingActivities = activitiesResponse.filter(
          (activity) => activity.status?.toLowerCase() === "booked"
        );
        const cancelledActivities = activitiesResponse.filter(
          (activity) => activity.status?.toLowerCase() === "cancelled"
        );

        const completedItineraries = itinerariesResponse.filter(
          (itinerary) =>
            itinerary?.completionStatus?.toLowerCase() === "completed"
        );
        const pendingItineraries = itinerariesResponse.filter(
          (itinerary) =>
            itinerary?.completionStatus?.toLowerCase() === "pending"
        );
        const cancelledItineraries = itinerariesResponse.filter(
          (itinerary) =>
            itinerary?.completionStatus?.toLowerCase() === "cancelled"
        );

        // Update filtered lists
        setCompletedActivitiesList(completedActivities);
        setPendingActivitiesList(pendingActivities);
        setCancelledActivitiesList(cancelledActivities);

        setCompletedItinerariesList(completedItineraries);
        setPendingItinerariesList(pendingItineraries);
        setCancelledItinerariesList(cancelledItineraries);
      } else {
        console.error("Unexpected data structure");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchDataAndFilter();
  }, []);

  useEffect(() => {
    if (!loading) {
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
        setShowingActivities(updatedItems);
        setShowingItineraries(allItinerariesList);
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
        setShowingItineraries(updatedItems);
        setShowingActivities(allActivitiesList);
      }
    }
  }, [
    mainTab,
    subTab,
    allActivitiesList,
    pendingActivitiesList,
    completedActivitiesList,
    cancelledActivitiesList,
    allItinerariesList,
    pendingItinerariesList,
    completedItinerariesList,
    cancelledItinerariesList,
    loading,
  ]);

  const renderSubTabs = () => {
    if (mainTab === "products") {
      return (
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="purchased">Purchased</TabsTrigger>
        </TabsList>
      );
    } else {
      return (
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      );
    }
  };

  
const handleRateActivity = () => {};

const handleRateItinerary = () => {};

const handleRateTourGuide = () => {};

const handleCancelBooking = async (type, bookingId) => {
  let response;
  if (type === "activity") {
    response = await cancelActivityBooking(bookingId); // Await the response
    fetchDataAndFilter();
  } else {
    response = await cancelItineraryBooking(bookingId); // Await the response
    fetchDataAndFilter()
  }
  alert(response.message); // Show the message once the response is received


};

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


const renderCards = () => {
  if (mainTab === "activities" && showingActivities) {
    return showingActivities.filter(a => a.activityId != null).map((activityBooking) => ( 
      <ActivitiesCard key={activityBooking.id} activityBooking={activityBooking} />
    ));
  } else {
    return showingItineraries.filter(a => a.itinerary != null).map((itineraryBooking) => (
      <ItinerariesCard key={itineraryBooking.id} itineraryBooking={itineraryBooking} />
    ));
  }
};

  const ActivitiesCard = ({activityBooking}) => {
    return (
      <Card
        className="w-full max-w-6xl overflow-hidden"
      >
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              {getIcon("activities")}
              {activityBooking.activityId.title}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 w-full">
          <div className="flex flex-wrap justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                {activityBooking.activityId.description}
              </p>
            </div>
            <Badge>
              {activityBooking.status && (activityBooking.status.charAt(0).toUpperCase() +
                activityBooking.status.slice(1))}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4" />
              <span>
                Date: {new Date(activityBooking.activityId.date).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              {/* <span>
                      Location: {activityBooking.activityId?.location.name !== ""
                        ? activityBooking.activityId?.location.name
                        : `${activityBooking.activityId?.location.lat}, ${activityBooking.activityId?.location.lng}`}
                    </span> */}
              <span>
                Location:{" "}
                {`${activityBooking.activityId.location.lat}, ${activityBooking.activityId.location.lng}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSignIcon className="w-4 h-4" />
              <span>
                Price:{" "}
                {activityBooking.activityId.price -
                  activityBooking.activityId.price *
                    activityBooking.activityId.discount}
              </span>
            </div>
            {/* <div className="flex items-center gap-2 text-sm text-gray-600">
              <StarIcon className="w-4 h-4" />
              <span>
                Average Rating: {activityBooking.activityId.averageRating}
              </span>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <ClockIcon className="w-4 h-4" />
              <span>
                Booked on:{" "}
                {new Date(activityBooking.bookingDate).toLocaleString()}
              </span>
            </div>
            {activityBooking.rating && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <StarIcon className="w-4 h-4" />
                <span>Your Rating: {activityBooking.rating}/5</span>
              </div>
            )}
            {activityBooking.comment && (
              <div className="text-sm text-gray-600">
                <p className="font-semibold">Your Comment:</p>
                <p className="italic">&quot;{activityBooking.comment}&quot;</p>
              </div>
            )} */}
          </div>
        </CardContent>
        <CardFooter className="p-6 flex flex-wrap gap-4">
          {activityBooking.status === "booked" && (
            <Button
              variant="destructive"
              onClick={()=>handleCancelBooking("activity", activityBooking._id)}
            >
              Cancel Booking
            </Button>
          )}
          {activityBooking.status === "completed" &&
            !activityBooking.comment && !activityBooking.rating && (
              <>
                <Button variant="outline" onClick={()=>handleRateActivity}>
                  Rate Activity
                </Button>
              </>
            )}
        </CardFooter>
      </Card>
    );
  };
  
  const ItinerariesCard = ({itineraryBooking}) => {
    return (
      <Card
        className="w-full max-w-6xl overflow-hidden"
      >
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              {getIcon("itineraries")}
              {itineraryBooking.itinerary.name}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 w-full">
          <div className="flex flex-wrap justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                {itineraryBooking.itinerary.description}
              </p>
            </div>
            <Badge
            // className={`${statusColor[itineraryBooking.completionStatus]} text-white`}
            >
              {itineraryBooking && (itineraryBooking.completionStatus.charAt(0).toUpperCase() +
                itineraryBooking.completionStatus.slice(1))}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/*<div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarIcon className="w-4 h-4" />
            <span>
              Date:{" "}
              {new Date(itineraryBooking.itinerary?.date).toLocaleString()}
            </span>
          </div>*/}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              <span>
                Sites: {itineraryBooking.itinerary.historicalSites.join(", ")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSignIcon className="w-4 h-4" />
              <span>Price: {itineraryBooking.itinerary.price}</span>
            </div>
            {/* <div className="flex items-center gap-2 text-sm text-gray-600">
            <StarIcon className="w-4 h-4" />
            <span>Average Rating: {activityBooking.activityId?.averageRating.toFixed(1)}</span>
          </div> */}
          </div>
  
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <ClockIcon className="w-4 h-4" />
              <span>
                Booked on:{" "}
                {new Date(itineraryBooking.bookingDate).toLocaleString()}
              </span>
            </div>
            {/* {itineraryBooking.rating && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <StarIcon className="w-4 h-4" />
              <span>Your Rating: {itineraryBooking.ratingGiven}/5</span>
            </div>
          )} */}
            {/* {booking.comment && (
            <div className="text-sm text-gray-600">
              <p className="font-semibold">Your Comment:</p>
              <p className="italic">&quot;{activityBooking.comment}&quot;</p>
            </div>
          )} */}
          </div>
        </CardContent>
        <CardFooter className=" p-6 flex flex-wrap gap-4">
          {itineraryBooking.completionStatus === "Pending" && (
            <Button
              variant="destructive"
              onClick={()=>handleCancelBooking("itinerary", itineraryBooking._id)}
            >
              Cancel Booking
            </Button>
          )}
          {itineraryBooking.completionStatus === "Completed" &&
            !itineraryBooking.ratingGiven && (
              <>
                <Button variant="outline" onClick={()=>handleRateTourGuide}>
                  Rate Tour Guide
                </Button>
                <Button variant="outline" onClick={()=>handleRateItinerary}>
                  Rate Itinerary
                </Button>
              </>
            )}
        </CardFooter>
      </Card>
    );
  };
  

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="container mx-auto p-4 bg-background">
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>
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


