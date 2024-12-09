"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DeletionRequestsAdmin = () => {
  const [sidebarState, setSidebarState] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchDeletionRequests();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const fetchDeletionRequests = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/Allrequests", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(data);
      } else {
        toast.error("Failed to load requests");
      }
    } catch (error) {
      toast.error("Failed to fetch deletion requests");
    }
  };

  const handleDelete = async (username, type) => {
    try {
      await fetch("http://localhost:5001/api/usersOnly", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username, type }),
      });

      await fetch("http://localhost:5001/api/delete-request", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username }),
      });

      setRequests(requests.filter((request) => request.username !== username));
      toast.success("User deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  // Filter and pagination logic
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || request.userType.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarState}
        toggleSidebar={() => setSidebarState(!sidebarState)}
      />
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={() => setSidebarState(!sidebarState)} />
        
        <main className="flex-1 py-16 bg-gray-50"> {/* Consistent top/bottom padding */}
        <div className="container mx-auto p-6 w-4/5">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold mt-12">Deletion Requests</h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="mb-6 flex justify-between items-center">
                <div className="relative w-1/3">
                  <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <Select
                  value={selectedType}
                  onValueChange={(value) => {
                    setSelectedType(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px] text-sm">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-sm">All Types</SelectItem>
                    <SelectItem value="tourguide" className="text-sm">Tour Guide</SelectItem>
                    <SelectItem value="advertiser" className="text-sm">Advertiser</SelectItem>
                    <SelectItem value="seller" className="text-sm">Seller</SelectItem>
                    <SelectItem value="user" className="text-sm">Regular User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-medium text-gray-700 pl-6 text-sm">Username</TableHead>
                      <TableHead className="font-medium text-gray-700 text-sm">User Type</TableHead>
                      <TableHead className="font-medium text-gray-700 text-sm text-center">Request Date</TableHead>
                      <TableHead className="font-medium text-gray-700 text-sm text-right pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRequests.map((request) => (
                      <TableRow key={request._id} className="hover:bg-gray-50">
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="font-medium text-gray-900 text-sm">{request.username}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-gray-600 text-sm">
                          {request.userType}
                        </TableCell>
                        <TableCell className="py-4 text-center text-gray-600 text-sm">
                          {new Date(request.requestDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6">
                          <button
                            className="flex items-center text-red-600 hover:text-red-800 transition duration-200 ml-auto text-sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? 'bg-black text-white hover:bg-black' : ''}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-500 mt-2">
              Are you sure you want to delete user "{selectedRequest?.username}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedRequest && handleDelete(selectedRequest.username, selectedRequest.userType)}
              className="bg-red-600 hover:bg-red-700 text-sm"
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeletionRequestsAdmin;
