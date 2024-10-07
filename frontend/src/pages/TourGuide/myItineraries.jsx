"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getMyItineraries } from "@/services/itirenaryService.js"; // Import itinerary service

const ItineraryPage = () => {
  const [sidebarState, setSidebarState] = useState(false);
  const [itineraries, setItineraries] = useState([]);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState(null);
  const [updatedItineraryData, setUpdatedItineraryData] = useState({});
  const [newItineraryData, setNewItineraryData] = useState({});

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await getMyItineraries();
        if (response && response.success && Array.isArray(response.itineraries)) {
          setItineraries(response.itineraries);
        } else {
          throw new Error("Fetched data is not valid.");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch itineraries.",
          duration: 3000,
        });
      }
    };

    fetchItineraries();
  }, [toast]);

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };

 

  return (
    <div style={{ display: "flex" }}>
      <Sidebar state={sidebarState} toggleSidebar={toggleSidebar} />
      <div
        style={{
          transition: "margin-left 0.3s ease",
          marginLeft: sidebarState ? "250px" : "0",
          width: "100%",
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Itinerary Management</h1>

          {/* Create Itinerary Dialog */}


          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Itinerary Name</TableHead>
                <TableHead>Activities</TableHead>
                <TableHead>Available Slots</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itineraries.map((itinerary) => (
                <TableRow key={itinerary._id}>
                  <TableCell>{itinerary.name}</TableCell>
                  <TableCell>{itinerary.activities.map(a => a.name).join(", ")}</TableCell>
                  <TableCell>{itinerary.availableSlots.length}</TableCell>
                  <TableCell>
                    <Button onClick={() => openEditModal(itinerary)} className="mr-2">Edit</Button>
                    <Button onClick={() => handleDeleteItinerary(itinerary._id)} className="bg-red-500 text-white">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ItineraryPage;