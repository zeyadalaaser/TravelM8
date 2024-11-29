import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Tag, MapPin, Bookmark, Share } from "lucide-react";
import { Stars } from "@/components/Stars";
import { ShareButton } from "@/components/ui/share-button";

const BookmarksHistory = () => {
  const token = localStorage.getItem("token");
  const [bookmarkedActivities, setBookmarkedActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/bookmarks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const bookmarks = data.allBookmarks.filter(b => b.bookmark);
        setBookmarkedActivities(bookmarks);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [token]);

  const handleRemoveBookmark = async (activityId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activityId })
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        fetchBookmarks();
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
      alert("Failed to remove bookmark");
    }
  };

  const ActivityCard = ({ bookmark }) => {
    const activity = bookmark.activityId;
    
    return (
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
                  onClick={() => handleRemoveBookmark(activity._id)}
                  className="text-gray-500 hover:text-black"
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
              <Clock className="w-4 h-4 mr-1" />
              {activity.date.slice(0, 10)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-2 gap-2">
              <MapPin className="w-4 h-4 mr-1" />
              {activity?.location?.name || `${activity?.location?.lat}, ${activity?.location?.lng}`}
            </div>
            {activity.tags?.length > 0 && (
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <Tag className="w-4 h-4 mr-1" />
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
            <div className="text-xl font-bold">
              {Array.isArray(activity.price) && activity.price.length === 2
                ? `${activity.price[0]} - ${activity.price[1]} EGP`
                : `${activity.price} EGP`}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-background">
      <h1 className="text-3xl font-bold mb-6 text-center">My Bookmarked Activities</h1>
      <div className="space-y-4">
        {bookmarkedActivities.length > 0 ? (
          bookmarkedActivities.map((bookmark) => (
            <ActivityCard 
              key={bookmark._id} 
              bookmark={bookmark}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No bookmarked activities found.</p>
        )}
      </div>
    </div>
  );
};

export default BookmarksHistory;