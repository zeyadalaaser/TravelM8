import React, { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import DashboardsNavBar from "../../components/DashboardsNavBar.jsx";
import ActivityCard from "../../components/ActivityCard/ActivityCard.jsx";
import ActivityFormDialog from "./ActivityForm.jsx";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Calendar,
  ChevronDown,
  DollarSign,
  Layout,
  Map,
  Trash2,
  Plus,
  Settings,
  Tag,
  User,
  Users,
  MapPin,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer.jsx";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logout from "@/hooks/logOut.jsx";
import Header from "@/components/navbarDashboard.jsx";
import SalesReport from "../TourGuide/salesReport.jsx";
import TouristReport from "../TourGuide/TouristReport.jsx";
import axios from "axios";

const AdvertiserDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogArgs, setDialogArgs] = useState(null);
  const [activeTab, setActiveTab] = useState("activities");

  const navigate = useNavigate();
  const [reportData, setReportData] = useState([]);
  const token = localStorage.getItem("token");

  const fetchReport = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:5001/api/activitiesReport",
        {
          headers: { Authorization: `Bearer ${token}` },
          //params: { year, month, day },
        }
      );
      setReportData(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching activities report:");
    }
  };

  useEffect(() => {
    fetchReport();
  }, [token]);

  const openDialog = (args) => {
    if (args) setDialogArgs(args.activity);
    else setDialogArgs(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogArgs(null);
  };

  useEffect(() => {
    if (!token) return; // No token, no need to check

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

  console.log(reportData);
  const fetchActivities = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token available. Redirecting to login.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/myActivities", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setActivities(data);
      } else {
        throw new Error("Invalid data format received from the server.");
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error.message || error);
    }
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token available. Redirecting to login.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/notifications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error.message || error);
    }
  };

  const getActivities = useDebouncedCallback(fetchActivities, 200);

  useEffect(() => {
    fetchActivities();

    return () => getActivities.cancel();
  }, []);

  useEffect(() => {
    if (activeTab === "notifications") {
      fetchNotifications();
    }
  }, [activeTab]);

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Header
            name={"samla121212"}
            type="Advertiser"
            editProfile="/advertiserProfile"
            dashboard="/advertiserDashboard"
          />
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Activities
                  </CardTitle>
                  <Map className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activities.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active activities
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      activities.filter((activity) => activity.isBookingOpen)
                        .length
                    }
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    $
                    {reportData.length > 0
                      ? reportData
                          .reduce((total, item) => total + item.revenue, 0)
                          .toFixed(2)
                      : "0.00"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Tourists
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                </CardContent>
              </Card>
            </div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4 mb-12"
            >
              <div className="flex mt-4 justify-between items-center">
                <TabsList>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                  <TabsTrigger value="sales">Sales Report</TabsTrigger>
                  <TabsTrigger value="tourists">Tourist Report</TabsTrigger>
                </TabsList>
                <Button onClick={() => openDialog(null)} variant="primary">
                  <Plus className="mr-2 h-4 w-4" /> Create Activity
                </Button>
              </div>

              <TabsContent value="activities" className="space-y-4">
                <ActivityCard
                  onRefresh={getActivities}
                  activities={activities}
                  isAdvertiser={true}
                  openDialog={openDialog}
                />
                <ActivityFormDialog
                  isOpen={isDialogOpen}
                  onClose={closeDialog}
                  dialogArgs={dialogArgs}
                  onRefresh={getActivities}
                />
              </TabsContent>
              <TabsContent value="notifications" className="space-y-4">
                <h2 className="text-2xl font-bold">Notifications</h2>
                {notifications.length > 0 ? (
                  <ul className="space-y-2">
                    {notifications.map((notification, index) => (
                      <li key={index} className="p-4 bg-white rounded shadow">
                        <p>{notification.message}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No notifications available.</p>
                )}
              </TabsContent>
              <TabsContent value="sales" className="space-y-4">
                <SalesReport />
              </TabsContent>
              <TabsContent value="tourists" className="space-y-4">
                <TouristReport />
              </TabsContent>
            </Tabs>
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
};

export default AdvertiserDashboard;
