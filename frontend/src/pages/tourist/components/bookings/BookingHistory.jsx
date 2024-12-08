import React, { useState, useEffect } from "react";

import {
  getActivityBookings,
  getItineraryBookings,
  cancelActivityBooking,
  cancelItineraryBooking,
} from "../../api/apiService";
import { Stars } from "@/components/Stars.jsx";
import axios from "axios";
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
import { Separator } from "@/components/ui/Separator";
import {
  CalendarIcon,
  MapPinIcon,
  Star,
  StarIcon,
  X,
  ShoppingCart,
  Compass,
  Briefcase,
} from "lucide-react";
import { ReviewDialog } from "../ratings/ReviewDialog.jsx";
import { toast } from "sonner";

const BookingHistory = () => {
  const token = localStorage.getItem("token");
  const today = new Date();

  const [dialogData, setDialogData] = useState({
    isOpen: false,
    touristId: null,
    entityId: null,
    entityType: null,
    onClose: null,
  });

  const [allActivitiesList, setAllActivitiesList] = useState([]);
  const [completedActivitiesList, setCompletedActivitiesList] = useState([]);
  const [pendingActivitiesList, setPendingActivitiesList] = useState([]);
  const [cancelledActivitiesList, setCancelledActivitiesList] = useState([]);

  const [allItinerariesList, setAllItinerariesList] = useState([]);
  const [completedItinerariesList, setCompletedItinerariesList] = useState([]);
  const [pendingItinerariesList, setPendingItinerariesList] = useState([]);
  const [cancelledItinerariesList, setCancelledItinerariesList] = useState([]);

  const [showingItineraries, setShowingItineraries] = useState([]);
  const [showingActivities, setShowingActivities] = useState([]);

  //////////////////////////////////////////////////////////////////////////
  const [mainTab, setMainTab] = useState("activities");
  const [subTab, setSubTab] = useState("all");
  // const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true); // Loading state to track data fetching completion

  let completed = false;
  let pending = false;
  let cancelled = false;

  const fetchDataAndFilter = async () => {
    try {
      setLoading(true); // Start loading

      const activitiesResponse = await getActivityBookings();
      console.log("Activities Response:", activitiesResponse);

      const itinerariesResponse = await getItineraryBookings();
      console.log("Itineraries Response:", itinerariesResponse);

      // Set state for main lists
      if (activitiesResponse && itinerariesResponse) {
        const filteredActivities = activitiesResponse.filter(
          (activity) =>
            activity.completionStatus === "Paid" ||
            activity.completionStatus === "Cancelled"
        );

        const filteredItineraries = itinerariesResponse.filter(
          (itinerary) =>
            itinerary.completionStatus === "Paid" ||
            itinerary.completionStatus === "Cancelled"
        );

        // Set the state with filtered data
        setAllActivitiesList(filteredActivities);
        setAllItinerariesList(filteredItineraries);
        setShowingActivities(filteredActivities);
        setShowingItineraries(filteredItineraries);

        console.log("Activities Set State:", filteredActivities);
        console.log("Itineraries Set State:", filteredItineraries);

        // Filter activities and itineraries after fetching
        const completedActivities = activitiesResponse.filter(
          (activity) =>
              activity.completionStatus?.toLowerCase() === "paid" &&
              new Date(activity?.activityId?.date) < today
      );
      
      const pendingActivities = activitiesResponse.filter(
          (activity) =>
              activity.completionStatus?.toLowerCase() === "paid" &&
              new Date(activity?.activityId?.date) > today
      );

        console.log("pending activities:", pendingActivities);

        const cancelledActivities = activitiesResponse.filter(
          (activity) => activity.completionStatus?.toLowerCase() === "cancelled"
        );

        const completedItineraries = itinerariesResponse.filter(
          (itinerary) =>
            itinerary?.completionStatus?.toLowerCase() === "paid" &&
            new Date(itinerary?.tourDate) < today
        );
        const pendingItineraries = itinerariesResponse.filter(
          (itinerary) =>
            itinerary?.completionStatus?.toLowerCase() === "paid" &&
            new Date(itinerary?.tourDate) > today
        );
        const cancelledItineraries = itinerariesResponse.filter(
          (itinerary) =>
            itinerary?.completionStatus?.toLowerCase() === "cancelled"
        );
        console.log("pending itineraries:", pendingItineraries);
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
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="purchased">Purchased</TabsTrigger>
        </TabsList>
      );
    } else {
      return (
        <TabsList className=" grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      );
    }
  };

  const closeDialog = () => {
    setDialogData((prev) => ({
      ...prev,
      isOpen: false,
    }));
    fetchDataAndFilter();
  };
  const openDialog = ({ touristId, entityId, entityType }) => {
    setDialogData({
      isOpen: true,
      touristId,
      entityId,
      entityType,
      onClose: closeDialog,
    });
  };

  const handleCancelBooking = async (type, bookingId) => {
    let response;
    try {
      if (type === "activity") {
        response = await cancelActivityBooking(bookingId); // Await the response
      } else {
        response = await cancelItineraryBooking(bookingId); // Await the response
      }
  
        toast(`Booking cancelled successfully! Amount refunded: $${response.amountRefunded}. New wallet balance: $${response.newBalance}.`);
     
  
      // Refresh the data after cancellation
      fetchDataAndFilter();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast("Failed to cancel booking. Please try again.");
    }
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
    if (mainTab === "activities") {
      if (!showingActivities || showingActivities.length === 0) {
        return (
          <div className="flex items-center justify-center h-full">
            <p>No {subTab} activities found.</p>
          </div>
        );
      }

      return showingActivities
        .filter((a) => a.activityId != null)
        .map((activityBooking) => (
          <ActivitiesCard
            key={activityBooking.id}
            activityBooking={activityBooking}
          />
        ));
    } else {
      if (!showingItineraries || showingItineraries.length === 0) {
        return (
          <div className="flex items-center justify-center h-full">
            <p>No {subTab} itineraries found.</p>{" "}
          </div>
        );
      }

      return showingItineraries
        .filter((a) => a.itinerary != null)
        .map((itineraryBooking) => (
          <ItinerariesCard
            key={itineraryBooking.id}
            itineraryBooking={itineraryBooking}
          />
        ));
    }
  };

  const ActivitiesCard = ({ activityBooking }) => {
    // console.log(getReviews(activityBooking.activityId, "Activity", activityBooking.touristId));
    //const averageRating = ratings.averageRating;
    pending =
      activityBooking.completionStatus == "Paid" &&
      new Date(activityBooking.activityId?.date) > today;
    completed =
      activityBooking.completionStatus == "Paid" &&
      new Date(activityBooking.activityId?.date) < today;
    cancelled = activityBooking.completionStatus == "Cancelled";
    return (
      <Card
        key={activityBooking._id}
        className="w-full overflow-hidden"
        style={{
          height: !completed && !pending ? "200px" : "290px",
        }}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="items-center flex gap-2">
              {getIcon("activities")}
              <span className="text-xl font-bold truncate">
                {activityBooking.activityId?.title}
              </span>
            </div>
            <Badge
              className={`
                ${
                  cancelled
                    ? "bg-red-600"
                    : pending
                    ? "bg-yellow-600"
                    : completed
                    ? "bg-green-600"
                    : "bg-gray-800"
                } 
                text-white
              `}
            >
              {activityBooking.completionStatus === "Paid"
                ? "Paid"
                : activityBooking.completionStatus === "Cancelled"
                ? activityBooking.completionStatus.charAt(0).toUpperCase() +
                  activityBooking.completionStatus.slice(1)
                : "Unknown Status"}
            </Badge>
          </div>
          <CardDescription className="flex items-center mt-1">
            <CalendarIcon className="w-4 h-4 m-1 flex-shrink-0" />
            <span>
              Booked On:{" "}
              {new Date(activityBooking.bookingDate).toLocaleString()}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4 truncate">
            {activityBooking.activityId?.description}
          </p>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate max-w-[200px]-">
                Location: {`${activityBooking.activityId?.location?.name}`}
              </span>
            </div>
            <p className="text-2xl font-semibold">
              $
              {activityBooking.activityId?.price ||
                activityBooking.activityId?.price[0]}
            </p>
          </div>
          {!cancelled && (<Separator></Separator>)}
          <div className="w-full items-center flex justify-between mt-5">
            <div className="">
              {activityBooking.review && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Your Rating :</span>
                  <Stars rating={activityBooking.review.rating} />
                </div>
              )}
              {activityBooking.review && (
                <div className="gap-2 text-sm flex text-gray-600">
                  <p className="font-semibold">Your Comment :</p>
                  <p className="italic">
                    &quot;{activityBooking.review?.comment}&quot;
                  </p>
                </div>
              )}
            </div>
            <div>
              {activityBooking.completionStatus == "Paid" &&
                new Date(activityBooking.activityId.date) < today && (
                  <div className="flex flex-col justify-between space-y-1.5">
                    <Button
                      onClick={() => {
                        openDialog({
                          touristId: activityBooking.touristId,
                          entityId: activityBooking.activityId || null,
                          entityType: "Activity",
                        });
                      }}
                      disabled={activityBooking.activityId === null}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Rate Activity
                    </Button>
                  </div>
                )}
              {activityBooking.completionStatus == "Paid" &&
                new Date(activityBooking.activityId?.date) > today && (
                  <div className="flex flex-col justify-between m-2">
                    {/* <Separator></Separator> */}
                    <Button
                      variant="destructive"
                      className="mr-auto"
                      size="sm"
                      onClick={() =>
                        handleCancelBooking("activity", activityBooking._id)
                      }
                      disabled={activityBooking.activityId === null}
                    >
                      Cancel Booking
                    </Button>
                  </div>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ItinerariesCard = ({ itineraryBooking }) => {
    pending =
      itineraryBooking.completionStatus == "Paid" &&
      new Date(itineraryBooking.tourDate) > today;
    completed =
      itineraryBooking.completionStatus == "Paid" &&
      new Date(itineraryBooking.tourDate) < today;

    cancelled = itineraryBooking.completionStatus == "Cancelled";

    return (
      <Card
        key={itineraryBooking._id}
        style={{
          height: !completed && !pending ? "200px" : "290px",
        }}
        className="w-full overflow-hidden"
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="items-center flex gap-2">
              {getIcon("itineraries")}
              <span className="text-xl font-bold truncate">
                {itineraryBooking.itinerary?.name}
              </span>
            </div>
            <Badge
              className={`
                ${
                  cancelled
                    ? "bg-red-600"
                    : pending
                    ? "bg-yellow-600"
                    : completed
                    ? "bg-green-600"
                    : "bg-gray-800"
                } 
                text-white
              `}
            >
              {itineraryBooking.completionStatus === "Paid"
                ? "Paid"
                : itineraryBooking.completionStatus === "Cancelled"
                ? itineraryBooking.completionStatus.charAt(0).toUpperCase() +
                  itineraryBooking.completionStatus.slice(1)
                : "Unknown Status"}
            </Badge>
          </div>
          <CardDescription className="flex items-center mt-1">
            <CalendarIcon className="w-4 h-4 m-1 flex-shrink-0" />
            <span>
              Booked On:{" "}
              {new Date(itineraryBooking.bookingDate).toLocaleString()}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4 truncate">
            {itineraryBooking.itinerary?.description}
          </p>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                Sites: {itineraryBooking.itinerary?.historicalSites.join(", ")}
              </span>
            </div>
            <p className="text-2xl font-semibold">
              ${itineraryBooking.itinerary?.price}
            </p>
          </div>
          {!cancelled && (<Separator></Separator>)}
          <div className="w-full items-center flex justify-between mt-5">
            <div className="">
              {itineraryBooking.review && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Your Rating :</span>
                  <Stars rating={itineraryBooking.review.rating} />
                </div>
              )}
              {itineraryBooking.review && (
                <div className="gap-2 text-sm flex text-gray-600">
                  <p className="font-semibold">Your Comment :</p>
                  <p className="italic">
                    &quot;{itineraryBooking.review?.comment}&quot;
                  </p>
                </div>
              )}
            </div>
            <div>
              {completed && (
                <div className="flex flex-col justify-between space-y-1.5">
                  <div className="flex mr-auto gap-4">
                    <Button
                      onClick={() =>
                        openDialog({
                          touristId: itineraryBooking.tourist,
                          entityId: itineraryBooking.tourGuide || null,
                          entityType: "TourGuide",
                        })
                      }
                      disabled={itineraryBooking.tourGuide === null}
                      variant="secondary"
                      size="sm"
                      className="mr-auto flex-1 items-center justify-center"
                    >
                      <Star className="mr-1 h-4 w-4" />
                      Rate Tourguide
                    </Button>
                    <Button
                      onClick={() =>
                        openDialog({
                          touristId: itineraryBooking.tourist,
                          entityId: itineraryBooking.itinerary || null,
                          entityType: "Itinerary",
                        })
                      }
                      disabled={itineraryBooking.itinerary === null}
                      size="sm"
                      className="mr-auto flex-1 items-center justify-center"
                    >
                      <Star className="mr-1 h-4 w-4" />
                      Rate Itinerary
                    </Button>
                  </div>
                </div>
              )}
              {pending && (
                <div className="flex flex-col justify-between space-y-1.5 ">
                  <Button
                    variant="destructive"
                    className="mr-auto"
                    size="sm"
                    onClick={() =>
                      handleCancelBooking("itinerary", itineraryBooking._id)
                    }
                    disabled={itineraryBooking.itinerary === null}
                  >
                    Cancel Booking
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="container mx-auto p-4 bg-background">
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>
      <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
        <TabsList className=" bg-gray-300 grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
          <TabsTrigger value="flights">Flights</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
        </TabsList>

        <TabsContent value={mainTab}>
          <Tabs value={subTab} onValueChange={setSubTab}>
            {renderSubTabs()}
          </Tabs>

          <div className="grid grid-cols-1 gap-6">{renderCards()}</div>
        </TabsContent>
      </Tabs>
      <ReviewDialog
        isOpen={dialogData.isOpen}
        onClose={closeDialog}
        touristId={dialogData.touristId}
        entityId={dialogData.entityId}
        entityType={dialogData.entityType}
      />
    </div>
  );
};

export default BookingHistory;
