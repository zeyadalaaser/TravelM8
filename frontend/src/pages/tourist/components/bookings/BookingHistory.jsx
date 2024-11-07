import React, { useState, useEffect } from "react";
import {
  getActivityBookings,
  getItineraryBookings,
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
import { CalendarIcon, MapPinIcon, StarIcon, DollarSignIcon, ClockIcon, TagIcon, PercentIcon, UserIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"

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

  const [showingItineraries, setShowingItineraries] = useState([]);
  const [showingActivities, setShowingActivities] = useState([]);

  //////////////////////////////////////////////////////////////////////////
  const [mainTab, setMainTab] = useState("activities");
  const [subTab, setSubTab] = useState("all");

  const [loading, setLoading] = useState(true); // Loading state to track data fetching completion

// 

useEffect(() => {
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
        const completedActivities = activitiesResponse.filter(activity =>
          activity.status?.toLowerCase() === "completed"
        );
        const pendingActivities = activitiesResponse.filter(activity =>
          activity.status?.toLowerCase() === "booked"
        );
        const cancelledActivities = activitiesResponse.filter(activity =>
          activity.status?.toLowerCase() === "cancelled"
        );

        const completedItineraries = itinerariesResponse.filter(itinerary =>
          itinerary.completionStatus?.toLowerCase() === "completed"
        );
        const pendingItineraries = itinerariesResponse.filter(itinerary =>
          itinerary.completionStatus?.toLowerCase() === "pending"
        );
        const cancelledItineraries = itinerariesResponse.filter(itinerary =>
          itinerary.completionStatus?.toLowerCase() === "cancelled"
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
    return (mainTab === "activities"?(
      showingActivities.map((activityBooking) => (
        <Card key={activityBooking._id} className="w-full max-w-6xl overflow-hidden">
          <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  {getIcon(mainTab)}
                  {activityBooking.activityId.title}
                </span>
              </CardTitle>
            </CardHeader>
          {/* <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 relative">
              <img
                src={activityBooking.activityId.image}
                alt={activityBooking.activityId.title}
                className="w-full h-full object-cover"
              />
              {activityBooking.activityId.discount && (
                <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                  {activityBooking.activityId.discount}% OFF
                </Badge>
              )}
            </div> */}
            <CardContent className="p-6 md:w-2/3">
              <div className="flex flex-wrap justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {activityBooking.activityId.description}
                  </p>
                </div>
                <Badge
                  // className={`${statusColor[activityBooking.status]} text-white`}
                >
                  {activityBooking.status.charAt(0).toUpperCase() +
                    activityBooking.status.slice(1)}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    Date:{" "}
                    {new Date(activityBooking.activityId.date).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPinIcon className="w-4 h-4" />
                  <span>
                    Location: {activityBooking.activityId.location.lat},{","}
                    {activityBooking.activityId.location.lng}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSignIcon className="w-4 h-4" />
                  <span>Price: {activityBooking.activityId.price}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <StarIcon className="w-4 h-4" />
                  <span>Average Rating: {activityBooking.activityId.averageRating}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TagIcon className="w-4 h-4" />
                  <span>Category: {activityBooking.activityId.category}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserIcon className="w-4 h-4" />
                  <span>Advertiser: {activityBooking.activityId.name}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {activityBooking.activityId.tags.name.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      {activityBooking.activityId.isBookingOpen ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircleIcon className="w-4 h-4 text-red-500" />
                      )}
                      <span>
                        Booking {activityBooking.activityId.isBookingOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {activityBooking.activityId.isBookingOpen
                        ? "You can still book this activity"
                        : "This activity is no longer accepting bookings"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>
                    Booked on: {new Date(activityBooking.bookingDate).toLocaleString()}
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
                )}
              </div>
            </CardContent>
        </Card>
      ))): (showingItineraries.map((itineraryBooking) => (
        <Card key={itineraryBooking._id} className="w-full max-w-6xl overflow-hidden">
          <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  {getIcon(mainTab)}
                  {(itineraryBooking.itinerary.name)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:w-2/3">
              <div className="flex flex-wrap justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {itineraryBooking.itinerary.description}
                  </p>
                </div>
                <Badge
                  // className={`${statusColor[itineraryBooking.completionStatus]} text-white`}
                >
                  {itineraryBooking.completionStatus.charAt(0).toUpperCase() +
                    itineraryBooking.completionStatus.slice(1)}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/*<div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    Date:{" "}
                    {new Date(itineraryBooking.itinerary.date).toLocaleString()}
                  </span>
                </div>*/}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPinIcon className="w-4 h-4" />
                  <span>
                    Sites: {itineraryBooking.itinerary.historicalSites.join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSignIcon className="w-4 h-4" />
                  <span>Price: {itineraryBooking.itinerary.price}</span>
                </div>
                {/* <div className="flex items-center gap-2 text-sm text-gray-600">
                  <StarIcon className="w-4 h-4" />
                  <span>Average Rating: {activityBooking.activityId.averageRating.toFixed(1)}</span>
                </div> */}
                {/* <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TagIcon className="w-4 h-4" />
                  <span>Tags: {itineraryBooking.itinerary.tags.join(', ')}</span>
                </div> */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserIcon className="w-4 h-4" />
                  <span>TourGuide: {itineraryBooking.itinerary.tourGuideId.name}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>
                    Booked on: {new Date(itineraryBooking.bookingDate).toLocaleString()}
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
        </Card>
      )))
    )
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="container mx-auto p-4 bg-background">
      <h1 className="text-3xl font-bold mb-6 text-center">Bookings</h1>
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



// const renderitineraries = (itineraryBookings) =>{
//   return activityBookings.map((activityBooking) => (
//     <Card key={activityBooking._id} className="w-full max-w-6xl overflow-hidden">
//       <div className="flex flex-col md:flex-row">
//         <div className="md:w-1/3 relative">
//           <img
//             src={activityBooking.activityId.image}
//             alt={activityBooking.activityId.title}
//             className="w-full h-full object-cover"
//           />
//           {activityBooking.activityId.discount && (
//             <Badge className="absolute top-2 right-2 bg-red-500 text-white">
//               {activityBooking.activityId.discount}% OFF
//             </Badge>
//           )}
//         </div>
//         <CardContent className="p-6 md:w-2/3">
//           <div className="flex flex-wrap justify-between items-start mb-4">
//             <div>
//               <h2 className="text-2xl font-bold mb-2">
//                 {activityBooking.activityId.title}
//               </h2>
//               <p className="text-sm text-gray-600 mb-2">
//                 {activityBooking.activityId.description}
//               </p>
//             </div>
//             <Badge
//               className={`${statusColor[activityBooking.status]} text-white`}
//             >
//               {activityBooking.status.charAt(0).toUpperCase() +
//                 activityBooking.status.slice(1)}
//             </Badge>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <CalendarIcon className="w-4 h-4" />
//               <span>
//                 Date:{" "}
//                 {new Date(activityBooking.activityId.date).toLocaleString()}
//               </span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <MapPinIcon className="w-4 h-4" />
//               <span>
//                 Location: {activityBooking.activityId.location.lat.toFixed(2)},{" "}
//                 {activityBooking.activityId.location.lng.toFixed(2)}
//               </span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <DollarSignIcon className="w-4 h-4" />
//               <span>Price: {formatPrice(activityBooking.activityId.price)}</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <StarIcon className="w-4 h-4" />
//               <span>Average Rating: {activityBooking.activityId.averageRating.toFixed(1)}</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <TagIcon className="w-4 h-4" />
//               <span>Category: {activityBooking.activityId.category}</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <UserIcon className="w-4 h-4" />
//               <span>Advertiser: {activityBooking.activityId.advertiserName}</span>
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-2 mb-4">
//             {activity.tags.map((tag, index) => (
//               <Badge key={index} variant="secondary">
//                 {tag}
//               </Badge>
//             ))}
//           </div>
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
//                   {activity.isBookingOpen ? (
//                     <CheckCircleIcon className="w-4 h-4 text-green-500" />
//                   ) : (
//                     <XCircleIcon className="w-4 h-4 text-red-500" />
//                   )}
//                   <span>
//                     Booking {activityBooking.activityId.isBookingOpen ? "Open" : "Closed"}
//                   </span>
//                 </div>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>
//                   {activityBooking.activityId.isBookingOpen
//                     ? "You can still book this activity"
//                     : "This activity is no longer accepting bookings"}
//                 </p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//           <div className="border-t pt-4">
//             <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//               <ClockIcon className="w-4 h-4" />
//               <span>
//                 Booked on: {new Date(activityBooking.bookingDate).toLocaleString()}
//               </span>
//             </div>
//             {booking.rating && (
//               <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                 <StarIcon className="w-4 h-4" />
//                 <span>Your Rating: {activityBooking.rating}/5</span>
//               </div>
//             )}
//             {booking.comment && (
//               <div className="text-sm text-gray-600">
//                 <p className="font-semibold">Your Comment:</p>
//                 <p className="italic">&quot;{activityBooking.comment}&quot;</p>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </div>
//     </Card>
//   ));
// }

