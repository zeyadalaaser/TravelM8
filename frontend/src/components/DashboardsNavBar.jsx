import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Bell } from "lucide-react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LoginPage from "../pages/signIn/signin";
import SignupDialog from "../pages/SignUp/signup";
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

export default function Navbar({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { location } = useRouter();
  const currentPage = location.pathname + location.search;
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token: ", token);
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.userId) {
        setUserName(decodedToken.username);
        setUserRole(decodedToken.role);
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

  const markAsRead = async (notificationId) => {
    try {
      console.log("Marking notification as read with ID:", notificationId); // Log the notification ID
      await axios.patch(
        `http://localhost:5001/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the local state to mark the notification as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // Decrease the unread count
      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
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

      // Update the notifications state
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );

      // Update unread count
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
  const handleNotificationClick = async (notification) => {
    try {
      if (!notification._id) {
        console.error("Invalid notification ID");
        return;
      }

      //await markAsRead(notification._id); // Mark notification as read

      // Navigate to the product details if it's a product-out-of-stock notification
      if (
        notification.type === "product-out-of-stock" &&
        notification.metadata?.productId
      ) {
        navigate(`/admin/products/${notification.metadata.productId}`);
      }

      await fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications.map((notification) => markAsRead(notification._id))
      );
      setUnreadCount(0); // Reset unread count
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
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

  const openSignup = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
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
          TRAVELM8
        </div>
        <div className="flex-grow flex justify-center">
          {userRole === "Admin" && (
            <button
              onClick={() => navigate("/admin/dashboard")}
              className={`text-xl font-semibold ${
                currentPage === "/admin/dashboard" ? "text-white" : "text-black"
              }`}
            >
              Admin Dashboard
            </button>
          )}
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
                    <SheetDescription>
                      {userRole === "admin"
                        ? "System and product notifications"
                        : "Your notifications"}
                    </SheetDescription>
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
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            !notification.isRead
                              ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {notification.type === "product-out-of-stock" && (
                            <div className="flex items-center justify-between mb-2">
                              <span className="inline-block px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                                Stock Alert
                              </span>
                              {notification.metadata?.currentStock === 0 ? (
                                <span className="text-xs font-medium text-red-600">
                                  Out of Stock
                                </span>
                              ) : (
                                <span className="text-xs font-medium text-yellow-600">
                                  Low Stock:{" "}
                                  {notification.metadata?.currentStock}{" "}
                                  remaining
                                </span>
                              )}
                            </div>
                          )}
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
                  sx: { p: 0 },
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
                    navigate(
                      userRole === "admin"
                        ? "/admin/dashboard"
                        : "/tourist-profile"
                    );
                    handleClose();
                  }}
                >
                  My profile
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
            <>
              <LoginPage
                isOpen={isLoginOpen}
                onOpenChange={setIsLoginOpen}
                onSignupClick={openSignup}
              >
                <Button
                  variant="outline"
                  className={`bg-transparent rounded-full px-8 py-2 ${
                    currentPage === "/"
                      ? "text-white hover:bg-white/10 hover:text-white"
                      : "text-black"
                  } `}
                >
                  Login
                </Button>
              </LoginPage>
              <SignupDialog
                isOpen={isSignupOpen}
                onOpenChange={setIsSignupOpen}
                onLoginClick={openLogin}
              >
                <button
                  className={`font-medium rounded-full px-8 py-2 ${
                    currentPage === "/"
                      ? " bg-white text-black hover:bg-white/90"
                      : "rounded-full px-8 bg-gray-800 hover:bg-gray-700 text-white "
                  } `}
                >
                  Register
                </button>
              </SignupDialog>
            </>
          )}
        </div>
      </nav>
      <ContentWrapper>
        {React.Children.map(children, (child) => React.cloneElement(child))}
      </ContentWrapper>
    </>
  );
}
