import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, DollarSign, TrendingUp } from "lucide-react";
import { DatePicker } from "../components/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import axios from "axios";

const SalesReport = () => {
  const [date, setDate] = useState();
  const [allActivities, setAllActivities] = useState([]);
  const [allItineraries, setAllItineraries] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activitiesRevenue, setActivitiesRevenue] = useState(0);
  const [itinerariesRevenue, setItinerariesRevenue] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const token = localStorage.getItem("token");
  const fetchData = async () => {
    try {
    if (date) {
     
        const [itineraries, activities] = await Promise.all([
          axios.get("http://localhost:5001/api/itinerariesReport", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate(),
            },
          }),
          axios.get("http://localhost:5001/api/activitiesReport", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate(),
            },
          }),
        ]);
        setAllItineraries(itineraries.data.data || []);
        setAllActivities(activities.data.data || []);
    }
    else{
      const [itineraries, activities] = await Promise.all([
        axios.get("http://localhost:5001/api/itinerariesReport",{
          headers: {
          Authorization: `Bearer ${token}`,
        }}),
        axios.get("http://localhost:5001/api/activitiesReport", {
          headers: {
          Authorization: `Bearer ${token}`,
        }}),
      ]);
      setAllItineraries(itineraries.data.data || []);
      setAllActivities(activities.data.data || []);
    }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const refreshContet = () => {
    if (activeTab === "activities") {
      setSalesData(allActivities);
      setTotalRevenue(activitiesRevenue);
    } else if (activeTab === "itineraries") {
      setSalesData(allItineraries);
      setTotalRevenue(itinerariesRevenue);
    } else if (activeTab === "all") {
      setSalesData([]);
      setTotalRevenue(activitiesRevenue + itinerariesRevenue);
    }
  }
  const calculateRevenue = () => {
    const activitiesRev = allActivities.reduce((acc, { revenue }) => acc + revenue, 0) * 0.1;
    const itinerariesRev = allItineraries.reduce((acc, { revenue }) => acc + revenue, 0) * 0.1;
    console.log("itineraries revenue" ,itinerariesRev );
    console.log("activities revenue" ,activitiesRev );

    setActivitiesRevenue(activitiesRev);
    setItinerariesRevenue(itinerariesRev);

    console.log("itineraries revenue after setting" ,itinerariesRevenue );
    console.log("activities revenue after setting" ,activitiesRevenue );

    setTotalRevenue(activitiesRevenue + itinerariesRevenue);
    console.log("total revenue" ,totalRevenue );

  };

  useEffect(() => {
    fetchData();
  }, [date]);

  useEffect(()=>{
    // calculateRevenue();
    refreshContet();

  }, [activitiesRevenue,itinerariesRevenue]);

  useEffect(() => {
    calculateRevenue();
  }, [allActivities, allItineraries]);


  useEffect(() => {
    refreshContet();
  }, [activeTab]);

  const handleTabChange = (value) => setActiveTab(value);

  return (
    <Card className="w-full self-center text-black">
      <CardHeader className="w-full gap-2 ">
        <div className="flex items-center justify-between">
          <div className="flex-col">  
          <CardTitle className="text-2xl font-bold">Sales Report</CardTitle>
          {date
            ? <span className="text-sm  text-muted-foreground">Displaying Data of {date.toLocaleDateString()}</span>
            : <span className="text-sm  text-muted-foreground">Displaying All Data</span>
          }
          </div>
          <div className="flex items-center gap-2">
            {/* <Receipt className="h-8 w-8 text-green-300" /> */}
            <DatePicker date={date} setDate={setDate} />
          </div>
        </div>
        <div className="w-full self-center">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="w-full justify-evenly">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeTab !== "all" ? (
            salesData.map((sale) => (
              <div
                key={sale._id}
                className="text-md text-black bg-stone-50 p-6 rounded-lg flex items-center justify-between"
              >
                <div className="flex flex-col justify-center">
                  <p className="text-black">{sale.name}</p>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-1" />
                  <span className="font-bold">
                    {(sale.revenue * 0.1).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className=" text-md text-black bg-stone-50 p-6 rounded-lg flex items-center justify-between">
                <div>
                  <p className=" text-black">Activities</p>
                </div>
                <div className="flex">
                  <DollarSign className="h-5 w-5 mr-1" />
                  <span className="font-bold">
                    {activitiesRevenue.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className=" text-md text-black bg-stone-50 p-6 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-black">Itineraries</p>
                </div>
                <div className="flex">
                  <DollarSign className="h-5 w-5 mr-1" />
                  <span className="font-bold">
                    {itinerariesRevenue.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="font-semibold text-2xl">Total Sales</p>
          <div className="flex">
            <TrendingUp className="h-5 w-5 text-green-300 mr-2" />
            <span className="font-bold text-2xl">
              {totalRevenue.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesReport;
