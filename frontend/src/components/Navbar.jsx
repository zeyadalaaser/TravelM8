import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LoginPage from "../pages/signIn/signin";
import SignupDialog from "../pages/SignUp/signup";
import NotificationBadge from "@/components/notificationBadge.jsx";
import NotificationBadgeDark from "@/components/notificationBadgeDark.jsx";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Separator } from "@/components/ui/separator.tsx";
import LogoutAlertDialog from "@/hooks/logoutAlert";
import useRouter from "@/hooks/useRouter";
import {ChevronDown} from "lucide-react";

const pages = [
  { label: "Activities", value: "activities" },
  { label: "Itineraries", value: "itineraries" },
  { label: "Historical Places", value: "museums" },
  { label: "Products", value: "products" },
  { label: "Flights", value: "flights" },
  { label: "Hotels", value: "hotels" },

];

export default function Navbar({profilePageString}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { location, searchParams} = useRouter();
  const currentPage = location.pathname + location.search; 
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState(null);
  
  const open = Boolean(anchorEl);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setAlertOpen(true); // Open the alert dialog when "Logout" is clicked
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      if (currentTime > expirationTime) {
        localStorage.removeItem("token");
        return { valid: false, reason: 'Token has expired' };
      }
      if (decodedToken && decodedToken.userId) {
        setUserName(decodedToken.username);
      }
    }
  }, []);

  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1]; 
      const decodedPayload = JSON.parse(atob(payload)); 
      return decodedPayload;
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  };

  const openSignup = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    if (token) {
      setIsLoggedIn(true);
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const page = searchParams.get("type");
  return (
    <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 transition-all duration-300 ${
          currentPage === "/" ? "bg-transparent" : "bg-white text-black shadow-md"
        } ${isScrolled && currentPage === "/" ? "bg-gray-700/50 backdrop-blur-md" : "bg-gray-800"}`}
        style={{ height: "56px" }}
  >
      <div
              className={`text-2xl font-semibold ${
                currentPage === "/" ? "text-white" : "text-black"
              }`}
            >
              TRAVELM8
      </div>

  {/* Center the middle section */}
  <div className="hidden md:flex items-center justify-start ml-20 space-x-1">
    <button
      key="/"
      variant={currentPage === "/" ? "outline" : "ghost"}
      className={`${
        currentPage === "/" ? 
        "text-white hover:text-white/70 py-2 px-4" 
        : "text-black hover:text-black/70 py-2 px-4"
      }`}
      onClick={() => navigate(`/`)}
    >
      Home
    </button>
    {pages.map((page) => (
      <button
        key={page.value}
        variant={currentPage === page.value ? "outline" : "ghost"}
        className={`${
          currentPage === "/" 
            ? "text-white hover:text-white/70" 
            : "text-black hover:text-black/70"
        } ${
          currentPage === `/tourist-page?type=${page.value}` 
            ? "rounded-full py-2 px-4 border-[1px]" 
            : "rounded-full py-2 px-4 border-[1px] border-transparent bg-transparent"
        }`}
        onClick={() => navigate(`/tourist-page?type=${page.value}`)}
      >
        {page.label}
      </button>
    ))}
  </div>

  <div className="flex items-center space-x-4">
    {isLoggedIn ? (
      // Render when logged in
      <>
      {currentPage==="/"? <NotificationBadge />: <NotificationBadgeDark />}
      <button
          onClick={handleClick}
          className={`${
            currentPage === "/" ? 
            "text-white hover:text-white/80 border border-white rounded-full px-4 py-1 flex items-center space-x-2" 
            :"text-black hover:text-black/80 border border-black rounded-full px-4 py-1 flex items-center space-x-2"
          }`}
        >
          <span>Hello, {userName}</span>
          {currentPage==="/"?  <ChevronDown className="h-4 w-4 text-black-500" />:  <ChevronDown className="h-4 w-4 text-gray-500" />}
        </button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          PaperProps={{
            sx: {
              width: "200px",
            },
          }}
        >
          <MenuItem onClick={() => navigate("/tourist-profile")}>My profile</MenuItem>
          <MenuItem onClick={handleClose}>My bookings</MenuItem>
          <MenuItem onClick={handleClose}>Wallet</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
          <Separator />
          <MenuItem onClick={handleLogoutClick}>Sign out</MenuItem>
        </Menu>
        <LogoutAlertDialog
          isOpen={isAlertOpen}
          onClose={() => setAlertOpen(false)}
        />
      </>
    ) : (
      // Render when logged out
      <>
        <LoginPage
          isOpen={isLoginOpen}
          onOpenChange={setIsLoginOpen}
          onSignupClick={openSignup}
        >
          <Button
            variant="outline"
            className={`bg-transparent rounded-full px-8 py-2 ${
              currentPage === "/" ? "text-white hover:bg-white/10 hover:text-white" : "text-black"
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
            variant="outline"
            className={`font-medium rounded-full px-8 py-2 ${
              currentPage === "/" ? " bg-white text-black hover:bg-white/90" : "rounded-full px-8 bg-gray-800 hover:bg-gray-700 text-white "
            } `}
          >
            Register
          </button>
        </SignupDialog>
      </>
    )}
  </div>
</nav>

  );
};


