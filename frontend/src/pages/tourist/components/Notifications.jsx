import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"; 
import { Bell, Calendar, Check, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getActivityBookings, getItineraryBookings } from "../api/apiService";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Prefernces.css';

export default function NotificationSidebar({change}) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalLoading, setGeneralLoading] = useState(false); // Loading state for "General" tab
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming"); // Default tab set to "upcoming"
  const [unreadCount, setUnreadCount] = useState(0); // Adding unreadCount state to track the unread notifications

  const calculateTimeLeft = (eventDate) => {
    const difference = new Date(eventDate) - new Date();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (difference < 0) {
      return 'Event passed';
    } else if (days > 0) {
      return `${days} days left`;
    } else if (hours > 0) {
      return `${hours} hours left`;
    } else {
      return ' is soon';
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === "upcoming") { // Fetch notifications only if the "Upcoming Event" tab is active
      fetchNotifications();
    } else {
      fetchNotifications2();
    }
  }, [isOpen, activeTab]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const [activityBookings, itineraryBookings] = await Promise.all([getActivityBookings(), getItineraryBookings()]);
      const notifications = [
        ...activityBookings.filter(booking => booking.activityId).map(booking => ({
          id: booking._id,
          type: 'activity',
          status: booking.status,
          title: booking.activityId?.title,
          location: `${booking.activityId?.location?.lat}, ${booking.activityId?.location?.lng}`,
          eventDate: booking.activityId?.date,
          read: booking.status !== 'booked'
        })),
        ...itineraryBookings.filter(booking => booking.itinerary).map(booking => ({
          id: booking._id,
          type: 'itinerary',
          status: booking.completionStatus,
          title: booking.itinerary?.name,
          location: booking.itinerary?.historicalSites?.join(', '),
          eventDate: booking.tourDate,
          read: booking.completionStatus !== 'Pending'
        }))
      ]
        .filter(notification => notification.status === 'Paid')
        .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

      setNotifications(notifications);
      setUnreadCount(notifications.filter(n => !n.read).length); // Update unread count
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications2 = async () => {
    setGeneralLoading(true);  // Set loading state to true when fetching data
    try {
      const response = await axios.get('http://localhost:5001/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.notifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
    } finally {
      setGeneralLoading(false);  // Set loading state to false when fetching completes
    }
  };

  const formatNotificationMessage = (notification) => {
    const timeLeft = calculateTimeLeft(notification.eventDate);
    if (notification.type === 'activity') {
      return `Don't forget! Your activity "${notification.title}" - ${timeLeft}`;
    } else {
      return `Don't forget! Your itinerary "${notification.title}" - ${timeLeft}`;
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prevCount => prevCount - 1);
  };

  const markAsRead2 = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:5001/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification._id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
      setUnreadCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:5001/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification._id !== notificationId)
      );
      setUnreadCount(prevCount => {
        const notification = notifications.find(n => n._id === notificationId);
        return prevCount - (notification && !notification.isRead ? 1 : 0);
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete('http://localhost:5001/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification._id) {
      console.error("Invalid notification ID");
      return;
    }
    markAsRead2(notification._id);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={change ? "text-white hover:bg-transparent hover:text-white " : "text-black"}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Event</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <ScrollArea className="h-[calc(100vh-200px)] mt-4">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border shadow-sm hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : 'bg-white'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {notification.type === 'activity' ? (
                            <Calendar className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                          <Badge className={`${getStatusColor(notification.status)}`}>
                            {notification.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {formatNotificationMessage(notification)}
                      </p>
                      <div className="flex justify-end items-center text-xs mt-2">
                        <span className="text-gray-400">
                          {new Date(notification.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No notifications to display
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="general">
            <div className="mt-4 space-y-4 overflow-y-auto" style={{ maxHeight: "540px" }}>
              {generalLoading ? (
                <p className="text-center text-muted-foreground">Loading general notifications...</p>
              ) : notifications.length === 0 ? (
                <p className="text-center text-muted-foreground">No general notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <p className="font-medium">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification._id);
                      }}
                      className="text-red-500 hover:underline mt-2"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}