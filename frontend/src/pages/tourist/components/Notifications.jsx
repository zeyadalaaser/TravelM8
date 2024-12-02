import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bell, Calendar, Check, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getActivityBookings, getItineraryBookings } from "../api/apiService";
import React, { useState, useEffect } from 'react';
import './Prefernces.css';

export default function NotificationSidebar({currency,currentPage}) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

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
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const [activityBookings, itineraryBookings] = await Promise.all([
        getActivityBookings(),
        getItineraryBookings()
      ]);

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
          eventDate: booking.startDate,
          read: booking.completionStatus !== 'Pending'
        }))
      ]
        .filter(notification => notification.status === 'Paid')
        .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

      setNotifications(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
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
          className={(currentPage === "/" || currentPage === `/?currency=${currency}`)  ? "text-white hover:bg-transparent hover:text-white " : "text-black"}
        >
          <Bell className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">

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
                    className={`p-4 rounded-lg border shadow-sm hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50' : 'bg-white'
                    }`}
                    onClick={() => markAsRead(notification.id)}
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
                        {notification.read && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
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
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
