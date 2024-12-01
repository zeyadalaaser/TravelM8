import { Clock, Tag, MapPin, Bookmark, BookmarkPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/Stars";
import { ShareButton } from "@/components/ui/share-button";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEffect } from 'react';


function Activities({ token, bookActivity, activities, currency, exchangeRate }) {
  const [bookmarkedActivities, setBookmarkedActivities] = useState([]);

  const handleBook = async (activity) => {
    console.log(token);
    if (token) {
      const response = await bookActivity(activity._id, activity.price, "Card", token);
      console.log(response.message);
      alert(response.message);
    }
    else
      alert("You need to be logged in to book activities!");
  }
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
      alert("Please login to bookmark activities");
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
        alert(data.message);
      }else {
        throw new Error(`Server responded with ${response.status}: ${responseText}`);
      }
    } catch (error) {
      console.error("Error while bookmarking:", error);
      alert("Failed to update bookmark");
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <Card key={index} className="overflow-hidden">
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
                  className={`text-gray-500 hover:text-black ${
                  bookmarkedActivities.includes(activity._id) ? 'text-yellow-400' : ''
                  }`}
                  >
                  <Bookmark className="w-6 h-6" />
                </button>

                </div>
              </div>
              <div className="flex items-center mb-2">
                <Stars rating={activity.averageRating} />
                <span className="ml-2 text-sm text-muted-foreground">
                  {activity.totalRatings} reviews
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {activity.description}
              </p>
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
                    ? `${(activity.price[0] * exchangeRate).toFixed(2)} - ${(
                      activity.price[1] * exchangeRate
                    ).toFixed(2)} ${currency}`
                    : `${(activity.price * exchangeRate).toFixed(2)} ${currency}`}
                </span>
                <Button onClick={() => handleBook(activity)}>Book Activity!</Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default Activities;
