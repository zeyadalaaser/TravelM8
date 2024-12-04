import UsersReport from "./reports/usersReport";
import AdminActions from "./components/admin-actions";
import RevenueBreakdown from "./components/revenue-breakdown";
import SalesReport from "./reports/salesReport";
import { useState, useEffect } from "react";
// import { getSystemStats } from "./api/apiService.js";
import Sidebar from "@/components/Sidebar";
import { useNavigate } from "react-router-dom"; 
import { jwtDecode } from "jwt-decode";
import useRouter from "@/hooks/useRouter";
import Navbar from "@/components/DashboardsNavBar.jsx";


export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const [sidebarState, setSidebarState] = useState(false);
  const { location, searchParams } = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  console.log("from dashboard",token);

  useEffect(() => {

    if (!token) navigate("/"); // No token, no need to check

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        const timeout = setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/");
        }, (decodedToken.exp - currentTime) * 1000);

        return () => clearTimeout(timeout);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [token, navigate]);

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };

  return (
    <div className="min-h-[101vh] bg-gray-100">
      <main className="container w-5/6 mx-auto px-4 py-8">
        <Sidebar state={sidebarState} toggleSidebar={toggleSidebar} />
        <div
          style={{
            transition: "margin-left 0.3s ease",
            marginLeft: sidebarState ? "250px" : "0",
            width: "100%",
          }}
        >
          <Navbar toggleSidebar={toggleSidebar} />{" "}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <UsersReport />
              <RevenueBreakdown/>
            </div>
            <AdminActions
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            <SalesReport/>
          </div>
        </div>
      </main>
    </div>
  );
}
