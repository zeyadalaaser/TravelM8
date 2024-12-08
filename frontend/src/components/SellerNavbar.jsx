import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Bell } from "lucide-react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LogoutAlertDialog from "@/hooks/logoutAlert";
import useRouter from "@/hooks/useRouter";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import logo from "../assets/lb.png";

const ContentWrapper = ({ children }) => (
  <div className="pt-[76px]">{children}</div>
);

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
  } catch (e) {
    console.error("Failed to decode token:", e);
    return null;
  }
};

export default function SellerNavbar({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { location } = useRouter();
  const currentPage = location.pathname + location.search;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.userId) {
        setUserName(decodedToken.username);
        setIsLoggedIn(true);
        fetchNotifications(); // Fetch notifications when user logs in
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
      setUnreadCount((prevCount) => {
        const notification = notifications.find(
          (n) => n._id === notificationId
        );
        return prevCount - (notification && !notification.isRead ? 1 : 0);
      });
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setAlertOpen(true);
  };

  return (
    <>
      <nav
        className={`w-screen fixed top-0 left-0 right-0 z-50 flex items-center justify-between pl-6 pr-12 py-3 transition-all duration-300 ${
          currentPage === "/"
            ? "bg-transparent"
            : "bg-white text-black shadow-md"
        } ${
          isScrolled && currentPage === "/"
            ? "bg-gray-800/50 backdrop-blur-md"
            : "bg-gray-800"
        }`}
        style={{ height: "56px" }}
      >
        <div
          className={`text-2xl font-semibold ${
            currentPage === "/" ? "text-white" : "text-black"
          }`}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <div className="flex items-center -ml-8">
            <img src={logo} alt="TravelM8 Logo" className="h-20 w-auto -mr-4" />
            <span>TRAVELM8</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Sheet
                open={isNotificationsOpen}
                onOpenChange={setIsNotificationsOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={
                      currentPage === "/" ? "text-white" : "text-black"
                    }
                  >
                    <div className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </Button>
                </SheetTrigger>
                <SheetContent>
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
                    <SheetDescription>Your notifications</SheetDescription>
                  </SheetHeader>

                  {/* Scrollable Container */}
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
                </SheetContent>
              </Sheet>
              <button
                onClick={handleClick}
                className={`${
                  currentPage === "/"
                    ? "text-white hover:text-white/80 border border-white rounded-full px-4 py-1 flex items-center space-x-2"
                    : "text-black hover:text-black/80 border border-black rounded-full px-4 py-1 flex items-center space-x-2"
                }`}
              >
                <span>Hello, {userName}</span>
                <ChevronDown
                  className={`h-4 w-4 ${
                    currentPage === "/" ? "text-white" : "text-gray-500"
                  }`}
                />
              </button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                PaperProps={{
                  sx: {
                    width: "200px",
                    marginTop: "8px",
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/Sellerdashboard");
                    handleClose();
                  }}
                >
                  My Dashboard
                </MenuItem>
                <Separator />
                <MenuItem onClick={handleLogoutClick}>Sign out</MenuItem>
              </Menu>
              <LogoutAlertDialog
                isOpen={isAlertOpen}
                onClose={() => setAlertOpen(false)}
              />
            </>
          ) : (
            <>{/* Add any login or signup buttons here if needed */}</>
          )}
        </div>
      </nav>
      <ContentWrapper>
        {React.Children.map(children, (child) => React.cloneElement(child))}
      </ContentWrapper>
    </>
  );
}
