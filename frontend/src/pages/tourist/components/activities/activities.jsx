import { Clock, Tag, MapPin, Bookmark, BookmarkPlus } from "lucide-react";
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
function Activities({ token, bookActivity, activities, currency, exchangeRate }) {
  const [bookmarkedActivities, setBookmarkedActivities] = useState([]);
  const navigate = useNavigate();
  const handleBook = async (activity) => {
    console.log(token);
    if (token) {
      const response = await bookActivity(activity._id, activity.price, "Card", token);
      console.log(response.message);
      toast(`Success`, {
        description: `Activity booked successfully`,
      });
    }
    else
    toast(`Failed to book activity`, {
      description: `You need to be logged in first`,
    });
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

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <Card key={index} className="overflow-hidden h-[260px]">
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
                      className={`w-7 h-7 ${
                        bookmarkedActivities.includes(activity._id)
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
                    <Button onClick={() => handleBook(activity)}>
                      Book activity
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default Activities;
