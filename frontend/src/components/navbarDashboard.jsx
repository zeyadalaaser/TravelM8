import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx"; // Adjust the import path accordingly
import { Bell, UserCircle, ChevronDown } from "lucide-react"; // Adjust based on your icon setup
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import LogoutAlertDialog from "../hooks/logoutAlert";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import logo from "../assets/lb.png";

const Header = ({
  name = "Jane Doe",
  editProfile,
  type = "Tour Guide",
  dashboard,
}) => {
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notifications when the component mounts
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications(response.data.notifications);
      setUnreadCount(
        response.data.notifications.filter((n) => !n.isRead).length
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `http://localhost:5001/api/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update local state by removing the deleted notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );

      // Update unread count
      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete("http://localhost:5001/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Error clearing notifications:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleLogoutClick = () => {
    setAlertOpen(true);
  };

  return (
    <header className="bg-white h-16 shadow-sm">
      <div className="flex items-center justify-between px-7 py-0">
        {/* Title and Notifications */}
        <div className="flex items-center -ml-8 -mt-2">
          <img src={logo} alt="TravelM8 Logo" className="h-20 w-auto -mr-4" />
          <h1 className="text-2xl font-semibold text-gray-800">TravelM8</h1>
        </div>

        <div className="flex items-center -mt-2 relative">
          {/* Notification Button */}
          <Button
            variant="link" // Borderless button style
            size="icon"
            className="p-0 mr-4 flex items-center"
            onClick={() => setIsNotificationsOpen(true)} // Open sidebar on bell click
          >
            <div className="relative inline-block">
              <Bell className="h-6 w-6" /> {/* Increased size for consistency */}
              <span className="sr-only">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                  {unreadCount}
                </span>
              )}
            </div>
          </Button>

          {/* Profile Icon Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="link" className="p-0 flex items-center">
                <UserCircle className="h-6 w-6" /> {/* Consistent size with notification bell */}
                <ChevronDown className="h-4 w-4 text-gray-500 ml-1" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="w-full cursor-pointer"
                onClick={() => navigate(dashboard)}
              >
                My Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                className="w-full cursor-pointer"
                onClick={() => navigate(editProfile)}
              >
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogoutClick}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Notification Sidebar (Sheet) */}
      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetTrigger asChild>
          <Button variant="link" className="hidden"></Button>
        </SheetTrigger>
        <SheetContent>
          <div>
            <SheetHeader>
              <div className="flex justify-between items-center">
                <SheetTitle>Notifications</SheetTitle>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllNotifications} // Clear all notifications
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <SheetDescription>
                {notifications.length === 0
                  ? "No notifications"
                  : "Your notifications"}
              </SheetDescription>
            </SheetHeader>
            <div
              className="mt-4 space-y-4 overflow-y-auto"
              style={{ maxHeight: "540px" }} // Adjust the height as needed
            >
              {notifications.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No notifications
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      !notification.isRead
                        ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <p className="font-medium">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the notification click
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
          </div>
        </SheetContent>
      </Sheet>

      <LogoutAlertDialog
        isOpen={isAlertOpen}
        onClose={() => setAlertOpen(false)}
      />
    </header>
  );
};

export default Header;