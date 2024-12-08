import { Clock, Tag, MapPin, Bookmark, BookmarkPlus, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/Stars";
import { ShareButton } from "@/components/ui/share-button";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEffect } from 'react';
import ActivityDetails from "@/components/ActivityCard/activityDetails.jsx";
import { toast } from "sonner";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import PaymentDialog from "../bookings/payment-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

function ActivityCard({ token, bookActivity, activity, currency, exchangeRate }) {
    const [bookmarkedActivities, setBookmarkedActivities] = useState([]);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [toBook, setToBook] = useState();
    const [notifiedActivities, setNotifiedActivities] = useState([]);
    const [activeDialogId, setActiveDialogId] = useState(null);

    const navigate = useNavigate();

    const openDialog = (activity) => {
        if (!token) {
            toast('Please login to perform this action');
            return;
        }
        setToBook(activity);
        setPaymentOpen(true);
    }

    const handleBook = async (paymentMethod, walletBalance) => {
        const response = await bookActivity(toBook._id, toBook.price, paymentMethod, token);
        let message = response.data.message;
        if (paymentMethod === "Wallet")
            message += " Your wallet balance is now " + (walletBalance * 1).formatCurrency(currency) + ".";

        if (response.status === 201)
            toast("Successful Booking of Activity!", { description: message });
        else
            toast(response.data.message);
    }

    useEffect(() => {
        if (!token) return;
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decodedToken.exp < currentTime) {
                localStorage.removeItem("token");
                navigate("/");
            } else {
                const timeout = setTimeout(() => {
                    localStorage.removeItem("token");
                    navigate("/");
                }, (decodedToken.exp - currentTime) * 1000);

                return () => clearTimeout(timeout);
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            localStorage.removeItem("token");
            navigate("/");
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/bookmarks?type=Activity', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const bookmarkedIds = data.allBookmarks
                        .filter(b => b.bookmark)
                        .map(b => b.itemId?._id || b.activityId?._id);
                    setBookmarkedActivities(bookmarkedIds);
                }
            } catch (error) {
                console.error("Error fetching bookmarks:", error);
            }
        };

        if (token) {
            fetchBookmarks();
        }
    }, [token]);

    const handleBookmark = async (activityId) => {
        if (!token) {
            toast(`Failed to bookmark activity`, {
                description: `You need to be logged in first`,
            });
            return;
        }
        try {
            console.log("Sending bookmark request:", {
                itemId: activityId,
                itemType: 'Activity'
            });

            const response = await fetch(`http://localhost:5001/api/bookmarks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    itemId: activityId,
                    itemType: 'Activity'
                })
            });
            // Log the raw response
            const responseText = await response.text();
            console.log("Raw response:", responseText);


            if (response.ok) {
                const data = JSON.parse(responseText);
                if (data.bookmark?.bookmark) {
                    setBookmarkedActivities(prev => [...prev, activityId]);
                } else {
                    setBookmarkedActivities(prev => prev.filter(id => id !== activityId));
                }
                toast(`${data.message}`)
            } else {
                throw new Error(`Server responded with ${response.status}: ${responseText}`);
            }
        } catch (error) {
            console.error("Error while bookmarking:", error);
            toast("Failed to update bookmark");
        }
    };

    const handleNotifyMe = (activityId) => {
        if (notifiedActivities.includes(activityId)) {
            toast(`Notification removed`, {
                description: `You will no longer receive updates for this activity`,
            });
            setNotifiedActivities(prev => prev.filter(id => id !== activityId));
        } else {
            toast(`Notification added`, {
                description: `You will be notified when this activity becomes available`,
            });
            setNotifiedActivities(prev => [...prev, activityId]);
        }
        setActiveDialogId(null);
    };

    return (
        <div className="space-y-4">
            <Card className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3">
                        <img
                            src={activity.image || "/placeholder.svg?height=200&width=300"}
                            alt={activity.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="w-full md:w-2/3 p-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold mb-1">{activity.title}</h3>
                            <div className="flex items-center space-x-2">
                                <ShareButton id={activity._id} name="activity" />
                                <button
                                    onClick={() => handleBookmark(activity._id)}
                                    className="w-10 h-10 text-gray-500 hover:text-black"
                                >
                                    <Bookmark
                                        className={`w-7 h-7 ${bookmarkedActivities.includes(activity._id)
                                            ? "fill-yellow-400 text-black"
                                            : "fill-none text-black"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center mb-2">
                            <Stars rating={activity.averageRating} />
                            <span className="ml-2 text-sm text-muted-foreground">
                                {activity.totalRatings} reviews
                            </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2 gap-2">
                            <Clock className="flex-shrink-0 w-4 h-4 mr-1" />
                            {activity.date.slice(0, 10)}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2 gap-2">
                            <MapPin className="flex-shrink-0 w-4 h-4 mr-1" />
                            {activity?.location?.name}
                        </div>
                        {activity.tags.length > 0 && (
                            <div className="flex items-center flex-wrap gap-2 mb-2">
                                <Tag className="flex-shrink-0 w-4 h-4 mr-1" />
                                {activity.tags.map((tag, tagIndex) => (
                                    <Badge key={tagIndex} variant="secondary">
                                        {tag.name}
                                    </Badge>
                                ))}
                            </div>
                        )}
                        {activity.category?.name && (
                            <div className="flex items-center mb-2">
                                <span className="text-sm font-semibold mr-2">Category:</span>
                                <Badge variant="outline">{activity.category.name}</Badge>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold">
                                {Array.isArray(activity.price) && activity.price.length === 2
                                    ? `${(activity.price[0] * exchangeRate).formatCurrency(
                                        currency
                                    )} - ${(activity.price[1] * exchangeRate).formatCurrency(
                                        currency
                                    )}`
                                    : `${(activity.price * exchangeRate).formatCurrency(
                                        currency
                                    )}`}
                            </span>
                            <div className="flex justify-end items-center">
                                <ActivityDetails
                                    activity={activity}
                                    bookActivity={bookActivity}
                                    currency={currency}
                                    token={token}
                                />
                                <div className="px-2">
                                    {activity.isBookingOpen ? (
                                        <>
                                            <Button onClick={() => openDialog(activity)}>
                                                Book activity
                                            </Button>

                                            <PaymentDialog
                                                isOpen={paymentOpen}
                                                currency={currency}
                                                onOpenChange={setPaymentOpen}
                                                amount={activity.price}
                                                token={token}
                                                onPaid={handleBook}
                                            />
                                        </>
                                    ) : (
                                        <Dialog 
                                            open={activeDialogId === activity._id && !notifiedActivities.includes(activity._id)}
                                            onOpenChange={(open) => {
                                                if (!token && open) {
                                                    toast.error("Authentication Required", {
                                                        description: "You need to be logged in first",
                                                    });
                                                    return;
                                                }
                                                setActiveDialogId(open ? activity._id : null);
                                            }}
                                        >
                                            <DialogTrigger asChild>
                                                <Button 
                                                    onClick={(e) => {
                                                        if (!token) {
                                                            e.preventDefault();
                                                            toast.error("You need to be logged in first");
                                                            return;
                                                        }
                                                        if (notifiedActivities.includes(activity._id)) {
                                                            e.preventDefault();
                                                            handleNotifyMe(activity._id);
                                                            return;
                                                        }
                                                    }}
                                                    className={`flex items-center gap-2 ${
                                                        notifiedActivities.includes(activity._id)
                                                            ? "bg-background hover:bg-accent text-yellow-500 border border-input"
                                                            : "bg-[#020817] hover:bg-[#020817]/90 text-white"
                                                    }`}
                                                >
                                                    <Bell className={`w-4 h-4 ${
                                                        notifiedActivities.includes(activity._id)
                                                            ? "fill-yellow-500 stroke-black"
                                                            : "text-white"
                                                    }`} />
                                                    {notifiedActivities.includes(activity._id) ? "Notified" : "Notify Me"}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Stay Updated</DialogTitle>
                                                    <DialogDescription className="pt-2">
                                                        Get notified when this activity opens for booking so you don't miss out on this amazing experience!
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter className="mt-4">
                                                    <Button onClick={() => handleNotifyMe(activity._id)}>
                                                        Get Notified
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default ActivityCard;
