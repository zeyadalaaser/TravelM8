import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircleUserRound,   ChevronDown } from "lucide-react";
import logo from "../assets/logo4.jpg";
import { Button } from "@/components/ui/button";
import useRouter from "@/hooks/useRouter";
import { cn } from "@/lib/utils.ts";
import NotificationBadge from "@/components/notificationBadgeDark.jsx";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Separator } from "@/components/ui/separator.tsx";
import LogoutAlertDialog from "@/hooks/logoutAlert";


const pages = [
    { label: "Home", value: "/" },
    { label: "Activities", value: "activities" },
    { label: "Itineraries", value: "itineraries" },
    { label: "Museums & Historical Places", value: "museums" },
    { label: "Shop", value: "products" },
    // { label: "Flights", value: "flights" },
    // { label: "Hotels", value: "hotels" },
    // { label: "View My Complaints", value: "complaints" },
    // { label: "Completed Tours", value: "completed-tours" },
    // { label: "Past Activities", value: "past-activities" },
    // {label: "Purchased Products", value: "products-purchased"},
    // {label: "My Bookings & History", value: "booking-history"}

];


const DashboardsNavBar = ({profilePageString}) => {
  const [userName, setUserName] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { location, searchParams} = useRouter();
  const currentPage = searchParams.get("type");
  const navigate = useNavigate();
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
        navigate("/");
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
  return (
  <div className="sticky top-0 z-10 shadow mx-auto bg-white w-full flex justify-between items-center px-4 py-1 h-[60px] mb-4">

        {/* Logo Section */}
        <div className="flex items-center">
          {/* <img className="w-20 h-15" src={logo} alt="TravelM8 Logo" /> */}
          <h1 className="text-2xl font-bold ml-2">TravelM8</h1>
        </div>

        {/* Pages Section */}
        <div className="hidden md:flex items-center justify-start ml-12 space-x-8">

          {pages.map((page) => (
            <Button
              key={page.value}
              variant={currentPage === page.value ? "outline" : "ghost"}
              className={cn(
                "rounded-full py-2 px-4 border-[1px]",
                { "border-transparent bg-transparent": currentPage !== page.value }
              )}
              onClick={() => navigate(`${location.pathname}?type=${page.value}`)}
            >
              {page.label}
            </Button>
          ))}
        </div>
        {/* Profile Section */}


        <div className="flex items-center">
        <NotificationBadge/>
        <button
          onClick={handleClick}
          className="text-black hover:text-black/70 border border-white rounded-full px-4 py-1 flex items-center space-x-2"
        >
          <span>Hello, {userName}</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
          <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              PaperProps={{
                sx: {
                  width: '200px',
                },
              }}
              >
              <MenuItem onClick={() => navigate(profilePageString)}>My profile</MenuItem>
              <MenuItem onClick={handleClose}>My bookings</MenuItem>
              <MenuItem onClick={handleClose}>Wallet</MenuItem>
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <Separator/>
              <MenuItem onClick={handleLogoutClick} >Sign out</MenuItem>
              </Menu>
              <LogoutAlertDialog
              isOpen={isAlertOpen}
              onClose={() => setAlertOpen(false)}
              />
        </div>
      </div>


  );
};

export default DashboardsNavBar;


