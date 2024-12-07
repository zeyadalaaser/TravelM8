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
import { Eye, EyeOff, X } from "lucide-react";
import { changePassword } from "../pages/admin/services/apiService.js";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
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

  //////////// Admin Shit ////////////////////////
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
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
    handleClose();
  };

  const openSignup = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }
    console.log("Password change requested");

    // Close the modal and reset fields
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast("New password must be at least 8 characters long");
      setError("New password must be at least 8 characters long");
      return;
    }
    try {
      const passwordData = {
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      };
      console.log(passwordData);
      const response = await changePassword(passwordData, token);
      toast("Password changed successfully");
      console.log("success");
      setIsPasswordModalOpen(false);
      setCurrentPassword(null);
      setNewPassword(null);
      setConfirmPassword(null);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message); // Display the specific error message
      } else {
        setError("An unexpected error occurred");
      }
    }
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
          <div className="flex items-center">
            <img src={logo} alt="TravelM8 Logo" className="h-20 w-auto -mr-4" />
            <span>TRAVELM8</span>
          </div>
        </div>
        <div className="flex-grow flex justify-center">
          {userRole === "Admin" && (
            <button
              onClick={() => navigate("/admin/dashboard")}
              className={`text-xl font-semibold ${
                currentPage === "/admin/dashboard" ? "text-white" : "text-black"
              }`}
            >
              Dashboard
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
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
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
                      {userRole === "Admin"
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
                {userRole !== "Admin" && (
                  <div>
                    <MenuItem
                      onClick={() => {
                        if (userRole === "Tourist") {
                          navigate("/tourist-profile");
                        }
                        handleClose();
                      }}
                    >
                      My profile
                    </MenuItem>
                    <Separator />
                  </div>
                )}
                {userRole === "Admin" && (
                  <MenuItem
                    onClick={() => {
                      setIsPasswordModalOpen(true);
                      handleClose();
                    }}
                  >
                    Change Password
                  </MenuItem>
                )}

                <Separator />
                <MenuItem onClick={handleLogoutClick}>Sign out</MenuItem>
              </Menu>
              <LogoutAlertDialog
                isOpen={isAlertOpen}
                onClose={() => setAlertOpen(false)}
              />
              {/* Password Change Modal */}
              {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Change Password</h2>
                      <button
                        onClick={() => setIsPasswordModalOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          id="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsPasswordModalOpen(false)}
                        className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePasswordChange}
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
