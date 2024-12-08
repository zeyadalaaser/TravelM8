import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import useRouter from "@/hooks/useRouter";
import LoginPage from "../pages/signIn/signin";
import SignupDialog from "../pages/SignUp/signup";
import logo from "../assets/lb.png";

export default function Navbar({ profilePageString, children }) {
  const router = useRouter();
  const navigate = useNavigate();
  const { pathname } = router;
  const currentPage = pathname;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showDashboardButton, setShowDashboardButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };

  const openSignup = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  useEffect(() => {
    // Check if the user is logged in (replace with your actual authentication logic)
    const isUserLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(isUserLoggedIn);
    setShowDashboardButton(isUserLoggedIn);
  }, []);

  return (
    <>
      <nav
        className={`w-screen fixed top-0 left-0 right-0 z-50 flex items-center justify-between pl-6 pr-12 py-3 transition-all duration-300 ${
          currentPage === "/"
            ? "bg-transparent"
            : "bg-white text-black shadow-md"
        } ${
          isScrolled && currentPage === "/"
            ? "bg-gray-900/50 backdrop-blur-md"
            : "bg-gray-800"
        }`}
        style={{ height: "56px" }}
      >
        <div
          className={`text-2xl font-semibold ${
            currentPage === "/" ? "text-white" : "text-black"
          }`}
        >
          <div className="flex items-center -ml-8">
            <img src={logo} alt="TravelM8 Logo" className="h-20 w-auto -mr-4" />
            <span>TRAVELM8</span>
          </div>
        </div>

        <div className="flex-1 text-center">
          <span
            className={`text-xl font-semibold ${
              currentPage === "/" ? "text-white" : "text-black"
            }`}
          >
            Dashboard
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {showDashboardButton && (
            <Button
              variant="outline"
              className={`bg-transparent rounded-full px-8 py-2 ${
                currentPage === "/"
                  ? "text-white hover:bg-white/10 hover:text-white"
                  : "text-black"
              }`}
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          )}

          {isLoggedIn ? (
            <>
              <Button
                variant="outline"
                className={`bg-transparent rounded-full px-8 py-2 ${
                  currentPage === "/"
                    ? "text-white hover:bg-white/10 hover:text-white"
                    : "text-black"
                }`}
                onClick={() => {
                  // Add logout logic here
                  localStorage.setItem("isLoggedIn", "false");
                  setIsLoggedIn(false);
                  setShowDashboardButton(false);
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                className={`font-medium rounded-full px-8 py-2 ${
                  currentPage === "/"
                    ? "bg-white text-black hover:bg-white/90"
                    : "rounded-full px-8 text-white"
                }`}
                onClick={() => (window.location.href = "/Admindashboard")}
              >
                Go To DashBoard
              </Button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
