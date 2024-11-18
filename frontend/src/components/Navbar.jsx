import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import LoginPage from "../pages/signIn/signin";
import SignupDialog from "../pages/SignUp/signup";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openSignup = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (

    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 transition-all duration-300 ${
        isScrolled ? "bg-gray-600/50 backdrop-blur-md" : "bg-transparent"}`}
      style={{ height: "56px" }} >
      
      <div className="text-2xl font-semibold text-white">TRAVELM8</div>
      
      {/* Center the middle section */}
      <div className="hidden md:flex items-center justify-start ml-20 space-x-8">
      <button className="text-white hover:text-white/80">Home</button>
        <button className="text-white hover:text-white/80">Activities</button>
        <button className="text-white hover:text-white/80">Itineraries</button>
        <button className="text-white hover:text-white/80">Historical Places</button>
        <button className="text-white hover:text-white/80">Shop</button>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Login Button */}
        <LoginPage isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} onSignupClick={openSignup}>
          <Button
            variant="outline"
            className="bg-transparent text-white hover:bg-white/10 hover:text-white rounded-full px-8 py-2" >
            Login
          </Button>
        </LoginPage>
        
        {/* Signup Button */}
        <SignupDialog isOpen={isSignupOpen} onOpenChange={setIsSignupOpen} onLoginClick={openLogin}>
          <Button
            variant="outline"
            className="bg-white font-medium text-black hover:bg-white/90 rounded-full px-8 py-2">
            Register
          </Button>
        </SignupDialog>
      </div>            
    </nav>
  );
};


