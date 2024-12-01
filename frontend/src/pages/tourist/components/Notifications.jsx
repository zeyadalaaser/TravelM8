import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Clock, CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const NotificationsHistory = () => {
    const token = localStorage.getItem("token");
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5001/api/notifications', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [token]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/notifications/${notificationId}/read`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchNotifications();
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const NotificationCard = ({ notification }) => {
        return (
            <Card className="overflow-hidden">
                <div className="p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            <h3 className="text-lg font-semibold">{notification.title}</h3>
                        </div>
                        <Badge variant={notification.read ? "secondary" : "default"}>
                            {notification.read ? "Read" : "Unread"}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        {notification.message}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(notification.createdAt).toLocaleString()}
                    </div>
                    {!notification.read && (
                        <div className="mt-4 flex justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification._id)}
                            >
                                Mark as Read
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const unreadNotifications = notifications.filter(n => !n.read);
    const readNotifications = notifications.filter(n => n.read);

    return (
        <div className="container mx-auto p-4 bg-background">
            <h1 className="text-3xl font-bold mb-6 text-center">Notifications</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="all">
                        All ({notifications.length})
                    </TabsTrigger>
                    <TabsTrigger value="unread">
                        Unread ({unreadNotifications.length})
                    </TabsTrigger>
                    <TabsTrigger value="read">
                        Read ({readNotifications.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <div className="space-y-4">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <NotificationCard
                                    key={notification._id}
                                    notification={notification}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No notifications found.</p>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="unread">
                    <div className="space-y-4">
                        {unreadNotifications.length > 0 ? (
                            unreadNotifications.map((notification) => (
                                <NotificationCard
                                    key={notification._id}
                                    notification={notification}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No unread notifications.</p>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="read">
                    <div className="space-y-4">
                        {readNotifications.length > 0 ? (
                            readNotifications.map((notification) => (
                                <NotificationCard
                                    key={notification._id}
                                    notification={notification}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No read notifications.</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default NotificationsHistory;