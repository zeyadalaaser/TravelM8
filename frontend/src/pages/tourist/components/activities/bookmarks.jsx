import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Tag, MapPin, Bookmark, Share } from "lucide-react";
import { Stars } from "@/components/Stars";
import { ShareButton } from "@/components/ui/share-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ItineraryCard from "@/components/ItineraryCard/ItineraryCard";

const BookmarksHistory = () => {
    const token = localStorage.getItem("token");
    const [bookmarkedActivities, setBookmarkedActivities] = useState([]);
    const [bookmarkedItineraries, setBookmarkedItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("activities");
  

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const activitiesResponse = await fetch('http://localhost:5001/api/bookmarks?type=Activity', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const itinerariesResponse = await fetch('http://localhost:5001/api/bookmarks?type=Itinerary', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (activitiesResponse.ok && itinerariesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        const itinerariesData = await itinerariesResponse.json();
        
        setBookmarkedActivities(activitiesData.allBookmarks.filter(b => b.bookmark));
        setBookmarkedItineraries(itinerariesData.allBookmarks.filter(b => b.bookmark));
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

  const handleRemoveBookmark = async (itemId, itemType) => {
    if (!token) {
        alert("Please login to manage bookmarks");
        return;
    }
    try {
        const response = await fetch(`http://localhost:5001/api/bookmarks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ 
                itemId: itemId,
                itemType: itemType
            })
        });
        // Get the raw response text first
        const responseText = await response.text();
        console.log("Raw response:", responseText);

        if (response.ok) {
            const data = JSON.parse(responseText);
            alert(data.message);
            fetchBookmarks(); // Refresh the bookmarks list
        } else {
            throw new Error(`Server responded with ${response.status}: ${responseText}`);
        }
    } catch (error) {
        console.error("Error removing bookmark:", error);
        alert("Failed to remove bookmark");
    }

};

  const ActivityCard = ({ bookmark, onRemove }) => {
    const activity = bookmark.itemId;
    
    if (!activity) {
      return null;
    }

    
    
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
          onClick={() => onRemove()} // Updated to use onRemove prop
          className="text-yellow-400 hover:text-gray-500"
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
  const ItineraryCard = ({ bookmark, onRemove }) => {
    const itinerary = bookmark.itemId;
    
    if (!itinerary) {
      return null;
    }

    
    return (
        <Card className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <img
                src={itinerary.images?.[0] || "/placeholder.svg?height=200&width=300"}
                alt={itinerary.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-2/3 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold mb-1">{itinerary.name}</h3>
                <div className="flex items-center space-x-2">
                  <ShareButton id={itinerary._id} name="itinerary" />
                  <button
                    onClick={() => onRemove()}
                    className="text-yellow-400 hover:text-gray-500"
                  >
                    <Bookmark className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="flex items-center mb-2">
                <Stars rating={itinerary.averageRating} />
                <span className="ml-2 text-sm text-muted-foreground">
                  {itinerary.totalRatings} reviews
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {itinerary.description}
                </p>
            {/* Add other itinerary details similar to ActivityCard */}
            <div className="text-xl font-bold">
              {`${itinerary.price} EGP`}
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
      <h1 className="text-2xl font-bold mb-6">My Bookmarks</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
        </TabsList>

        <TabsContent value="activities">
          <div className="space-y-4">
            {bookmarkedActivities.length > 0 ? (
              bookmarkedActivities.map((bookmark) => (
                bookmark.itemId ? (
                  <ActivityCard 
                    key={bookmark._id} 
                    bookmark={bookmark}
                    onRemove={() => handleRemoveBookmark(bookmark.itemId._id, 'Activity')}
                  />
                ) : null
              ))
            ) : (
              <p className="text-center text-gray-500">No bookmarked activities found.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="itineraries">
          <div className="space-y-4">
            {bookmarkedItineraries.length > 0 ? (
              bookmarkedItineraries.map((bookmark) => (
                bookmark.itemId ? (
                  <ItineraryCard 
                    key={bookmark._id} 
                    bookmark={bookmark}
                    onRemove={() => handleRemoveBookmark(bookmark.itemId._id, 'Itinerary')}
                  />
                ) : null
              ))
            ) : (
              <p className="text-center text-gray-500">No bookmarked itineraries found.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookmarksHistory;