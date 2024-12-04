import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Compass, Map, ShoppingBag } from 'lucide-react'
import { getSystemStats } from "../api/apiService.js";

// {activitiesRevenue, itinerariesRevenue, productsRevenue ,totalRevenue}
export default function RevenueBreakdown() {
  const [stats, setStats] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activitiesRevenue, setActivitiesRevenue] = useState(0);
  const [itinerariesRevenue, setItinerariesRevenue] = useState(0);
  const [productsRevenue, setProductsRevenue] = useState(0);
  
  useEffect(() => {
    const fetchStats = async () => {
      console.log("Fetching system stats...");
      try {
        const data = await getSystemStats(); // Wait for the async function to resolve
        console.log("Stats fetched: ", data);
        setStats(data); // Update stats
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (stats) {
      console.log("stats: ", stats);
      setTotalRevenue(stats.Total);
      setActivitiesRevenue(stats.Activities);
      setItinerariesRevenue(stats.Itineraries);
      setProductsRevenue(stats.Products);
      console.log("from revenue breakdown ", activitiesRevenue, itinerariesRevenue, productsRevenue ,totalRevenue)

    }
  }, [stats]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Breakdown</CardTitle>
        <CardDescription>Overview of revenue by category</CardDescription>
      </CardHeader>
      <CardContent className="h-4/5">
        <div className=" w-full h-full grid grid-cols-1 md:grid-cols-2 gap-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold overflow-hidden text-ellipsis">${totalRevenue || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities Revenue</CardTitle>
              <Compass className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold overflow-hidden text-ellipsis">${activitiesRevenue || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Itineraries Revenue</CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold overflow-hidden text-ellipsis">${itinerariesRevenue || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Revenue</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold overflow-hidden text-ellipsis">${productsRevenue || 0}</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

