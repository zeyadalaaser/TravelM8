'use client';

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, X } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
//import { getAllUsers, deleteUser } from "@/pages/admin/services/adminDeleteServices.js"; // Import the service


const DeletionRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [sidebarState, setSidebarState] = useState(false);
  const openDeleteDialog = (request) => {
    setSelectedRequest(request);  // Store the selected request to be deleted
    setIsDeleteDialogOpen(true);  // Open the confirmation dialog
  };
  
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);  // Close the dialog
    setSelectedRequest(null);  // Clear selected request
  };
  const { toast } = useToast();

  // Fetch deletion requests on component mount
  useEffect(() => {
    const fetchDeletionRequests = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/Allrequests', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,  // Authorization token
          },
        });
        const data = await response.json();
        if (response.ok) {
          setRequests(data);
        } else {
          console.error('Error fetching deletion requests:', data.message);
          toast({ title: "Failed to load requests", description: data.message });
        }
      } catch (error) {
        console.error('Error:', error);
        toast({ title: "Error", description: "Failed to fetch deletion requests" });
      }
    };
  
    fetchDeletionRequests();
  }, [toast]);  // Empty dependency array ensures it runs once on mount

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };
 
  // Function to delete both the user and their deletion request
const handleDelete = async (username, type) => {
  try {
    // Step 1: Delete the user
    const userResponse = await fetch('http://localhost:5001/api/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ username, type }),
    });

    // Check if the user deletion was successful
    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      throw new Error(errorData.message || 'Failed to delete the user');
    }

    // Step 2: Delete the deletion request
    const requestResponse = await fetch('http://localhost:5001/api/delete-request', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ username }),
    });
 
    if (!requestResponse.ok) {
      const errorData = await requestResponse.json();
      throw new Error(errorData.message || 'Failed to delete the deletion request');
    }

    // Update UI: remove the request from the displayed list
    setRequests(requests.filter((request) => request.username !== username));

    alert('User  deleted successfully');

  } catch (error) {
    console.error('Error deleting the user and/or deletion request:', error);
    alert('Failed to delete the user and/or deletion request');
  }
};


  const handleReject = (id) => {
    console.log(`Rejecting request for ID: ${id}`);
    // Add logic to reject deletion request here
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
        <div className="container mx-auto p-6 bg-background shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold mb-6 text-primary">Account Deletion Requests</h1>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="font-semibold text-muted-foreground">Username</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">User Type</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Request Date</TableHead>
                  <TableHead className="text-right font-semibold text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id} className="border-t">
                    <TableCell className="font-medium">{request.username}</TableCell>
                    <TableCell>{request.userType}</TableCell>
                    <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild> 
                        <Button variant="destructive" onClick={() => openDeleteDialog(request)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                            <span className="sr-only">Delete Account</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you sure you want to delete this account?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete the account and remove the data from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          {/* <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Username
                              </Label>
                              <Input
                                id="username"
                                value={selectedRequest ? selectedRequest.name : ''}
                                className="col-span-3"
                                readOnly
                              />
                            </div>
                          </div> */}
                          <DialogFooter>
                          <Button variant="outline" onClick={closeDeleteDialog}>
                          Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                if (selectedRequest) {
                                  handleDelete(selectedRequest.username, selectedRequest.userType); // Use selectedRequest's data
                                  // setIsDeleteDialogOpen(false); // Close dialog after deletion
                                }
                                closeDeleteDialog();  // Close the dialog after deletion

                              }}
                            >
                              Delete Account
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                   
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {requests.length === 0 && (
            <p className="text-center text-muted-foreground mt-6 p-4 bg-muted rounded-lg">
              No deletion requests found.
            </p>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DeletionRequestsAdmin;
