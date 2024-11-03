import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom"; // This is important for nested routes
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Recommend from "./components/Recommend";
import ScrollToTop from "./components/ScrollToTop";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import scrollreveal from "scrollreveal";
import Login from "./pages/signIn/login";
import TouristRegistration from './pages/SignUp/signupTourist';



export default function App() {
  // State to manage sidebar visibility
  const [sidebarState, setSidebarState] = useState(false);

  useEffect(() => {
    const sr = scrollreveal({
      origin: "top",
      distance: "80px",
      duration: 2000,
      reset: true,
    });
    sr.reveal(
      `
        nav,
        #hero,
        #services,
        #recommend,
        #testimonials,
        footer
      `,
      {
        opacity: 0,
        interval: 300,
      }
    );
  }, []);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar state={sidebarState} toggleSidebar={toggleSidebar} />
      <div style={{ transition: "margin-left 0.3s ease", marginLeft: sidebarState ? "250px" : "0", width: "100%" }}>
        <ScrollToTop />
        <Navbar toggleSidebar={toggleSidebar} />
        {/* Outlet for nested routing */}
        <Outlet />
        <Hero />
        <Services />
        <Recommend />
        <Testimonials />
        <Footer />
      </div>
    </div>
  );
}
