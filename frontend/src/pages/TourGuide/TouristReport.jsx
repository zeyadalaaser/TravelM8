import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";
import * as services from "@/pages/TourGuide/api/apiService.js";
import * as advertiserServices from "@/pages/Advertiser/api/apiService.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TouristReport() {
    const navigate = useNavigate();
    const [reportData, setReportData] = useState([]);
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [itineraries, setItineraries] = useState([]);
    const [activities, setActivities] = useState([]); // New state for activities
    const [selectedItineraryOrActivity, setSelectedItineraryOrActivity] = useState("");
    const [role, setRole] = useState(""); // New state to hold the role
    const dateInputRef = useRef(null);
    const token = localStorage.getItem("token");

    // Decode the token to get the role
    const getRoleFromToken = () => {
        try {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            return decodedToken.role;
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    };

    const fetchReport = async () => {
        setLoading(true);
        setError("");
        try {
            const endpoint =
                role === "TourGuide"
                    ? "http://localhost:5001/api/itinerariesReport"
                    : "http://localhost:5001/api/activitiesReport"; // Adjust based on role
            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
                params: { year, month, day },
            });
            setReportData(response.data?.data || []); // Ensure it's always an array
        } catch (err) {
            console.error(
                `Error fetching ${
                    role === "TourGuide" ? "itineraries" : "activities"
                } report:`,
                err
            );
            setError(err.response?.data?.message || "Failed to fetch report");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userRole = getRoleFromToken();
        setRole(userRole);
        if (!token || !userRole) {
            navigate("/");
            return;
        }
        fetchItinerariesOrActivities(userRole);
    }, [token, navigate]);

    useEffect(() => {
        if (role) {
            fetchReport();
        }
    }, [role, year, month, day]);

    const fetchItinerariesOrActivities = async (userRole) => {
        try {
            if (userRole === "TourGuide") {
                const response = await services.getMyItineraries(token);
                setItineraries(Array.isArray(response) ? response : []);
            } else if (userRole === "Advertiser") {
                const response = await advertiserServices.getMyActivities(token);
                setActivities(Array.isArray(response) ? response : []);
            }
        } catch (error) {
            console.error(
                `Error fetching ${role === "TourGuide" ? "itineraries" : "activities"}:`,
                error
            );
        }
    };

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        setDay(selectedDate.getDate());
        setMonth(selectedDate.getMonth() + 1); // Month is zero-indexed, so add 1
        setYear(selectedDate.getFullYear());
    };

    const handleMonthChange = (e) => {
        const selectedMonth = new Date(e.target.value);
        setMonth(selectedMonth.getMonth() + 1); // Month is zero-indexed
        setYear(selectedMonth.getFullYear());
        setDay(""); // Clear the day when filtering by month only
    };

    const clearFilters = () => {
        setYear("");
        setMonth("");
        setDay("");
        setSelectedItineraryOrActivity("");
        if (dateInputRef.current) {
            dateInputRef.current.value = ""; // Clear the date input field
        }
    };

    const combinedData = [...itineraries, ...activities].map((item) => {
        let reportItem;
      
        // Check if the item is from the itineraries (TourGuide)
        if (itineraries.includes(item)) {
          reportItem = reportData.find((report) => report.name === item.name);
        } 
        // Check if the item is from the activities (Advertiser)
        else if (activities.includes(item)) {
          reportItem = reportData.find((report) => report.name === item.title);
        }
      
        // Return the found report item or a default object with zero values
        return reportItem || { name: item.name || item.title, revenue: 0, bookingCount: 0 };
      });
      
      // Add any reportData entries that are not in itineraries or activities
      reportData.forEach((reportItem) => {
        const existsInCombinedData = combinedData.some(
          (data) => data.name === reportItem.name
        );
        
        if (!existsInCombinedData) {
          combinedData.push(reportItem); // Add missing reportItem to the combinedData
        }
      });
      

    const filteredReportData = Array.isArray(combinedData)
        ? combinedData.filter((item) =>
              selectedItineraryOrActivity
                  ? item.name === selectedItineraryOrActivity
                  : true
          )
        : [];

    return (
        <div className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-3 space-y-4">
                <Card className="col-span-3 w-full">
                    <CardHeader>
                        <CardTitle>Filter Tourist Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex space-x-2">
                            <Select value={selectedItineraryOrActivity} onValueChange={setSelectedItineraryOrActivity}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue
                                        placeholder={`Select ${
                                            role === "TourGuide" ? "Itinerary" : "Activity"
                                        }`}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {(role === "TourGuide" ? itineraries : activities)?.map((item) => (
                                        <SelectItem key={item?._id} value={role === "TourGuide" ? item.name : item.title}>
                                            {role === "TourGuide" ? item.name : item.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                type="date"
                                className="w-[180px]"
                                onChange={handleDateChange}
                                ref={dateInputRef}
                            />

                            <Select value={month} onValueChange={setMonth}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">January</SelectItem>
                                    <SelectItem value="2">February</SelectItem>
                                    <SelectItem value="3">March</SelectItem>
                                    <SelectItem value="4">April</SelectItem>
                                    <SelectItem value="5">May</SelectItem>
                                    <SelectItem value="6">June</SelectItem>
                                    <SelectItem value="7">July</SelectItem>
                                    <SelectItem value="8">August</SelectItem>
                                    <SelectItem value="9">September</SelectItem>
                                    <SelectItem value="10">October</SelectItem>
                                    <SelectItem value="11">November</SelectItem>
                                    <SelectItem value="12">December</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={clearFilters}>Clear Filters</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bar chart */}
            <Card>
    <CardHeader>
        <CardTitle>Total Tourists</CardTitle>
        <CardDescription>{`The number of tourists in each ${
            role === "TourGuide" ? "itinerary" : "activity"
        }`}</CardDescription>
    </CardHeader>
    <CardContent className="w-full md:h-[550px]">
        <ResponsiveContainer width="100%" height={500}>
            <BarChart data={filteredReportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
          dataKey="name"
          angle={-30}  // Make the text horizontal (no rotation)
          textAnchor="middle"  // Center the text under the bars
          height={120}  // Ensure there's enough space between the bars and the labels
          interval={0}
          tick={{ fontSize: 13 }}
          tickLine={false}  // Disable tick line for cleaner appearance
          dy={53}  // Adjust the vertical position (downward) of the labels
          dx={-10}  // Shift the labels slightly to the left, if needed
        />
                <YAxis
                   // ticks={[0, 10, 20, 30, 40, 50]}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Bar
                    dataKey="bookingCount"
                    fill="#82ca9d"
                    barSize={50} // Decrease bar width here
                    radius={[10, 10, 0, 0]} // Rounded edges for bars
                />
            </BarChart>
        </ResponsiveContainer>
    </CardContent>
</Card>

            {/* Table of tourists */}
            <Card>
                <CardHeader>
                    <CardTitle>Total number of Tourists</CardTitle>
                    <CardDescription>{`The number of tourists in each ${
      role === "TourGuide" ? "itinerary" : "activity"
    }`}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xl">{`  ${
      role === "TourGuide" ? "Itinerary" : "Activity"
    }`}</TableHead>
                                    <TableHead className="text-xl">Number of tourists</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReportData.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="text-lg">{item.name || item.title}</TableCell>
                                        <TableCell className="text-base">{item.bookingCount}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell className="text-lg">
                                        <strong>Total number of tourists</strong>
                                    </TableCell>
                                    <TableCell className="text-lg">
                                        <strong>
                                            {filteredReportData.reduce(
                                                (total, item) => total + item.bookingCount,
                                                0
                                            )}
                                        </strong>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
