"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/NavbarAdmin";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { getAllUsers, deleteUser } from "@/pages/admin/services/adminDeleteServices.js"; // Import the service
import { User } from "lucide-react";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DeleteUser() {
  const [sidebarState, setSidebarState] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      // Filter out admin users
      const nonAdminUsers = fetchedUsers.filter(user => user.type !== 'admin');
      setUsers(nonAdminUsers);
    } catch (error) {
      toast("Error", {
        description: "Failed to load users.",
        duration: 3000,
      });
    }
  };

  // Add this useEffect for initial load and refresh
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchUsers();
  }, []);

  // Add this useEffect specifically for page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };

  const handleDelete = async (username, userType) => {
    try {
      await deleteUser(username, userType);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.username !== username)
      );
      toast("Success", {
        description: "User deleted successfully.",
        duration: 3000,
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || user.type.toLowerCase() === selectedType.toLowerCase();
    const isNotAdmin = user.type !== 'admin';
    return matchesSearch && matchesType && isNotAdmin;
  });

  // Calculate pagination values
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Add this pagination helper function
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
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
        <main className="flex-1 py-16 bg-gray-50"> {/* Consistent top/bottom padding */}
        <div className="container mx-auto p-6 w-4/5">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold mt-12">User Management</h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-1/3">
                  <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <Select
                  value={selectedType}
                  onValueChange={setSelectedType}
                >
                  <SelectTrigger className="w-[180px] text-sm">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-sm">All Types</SelectItem>
                    <SelectItem value="tourguide" className="text-sm">Tour Guide</SelectItem>
                    <SelectItem value="advertiser" className="text-sm">Advertiser</SelectItem>
                    <SelectItem value="seller" className="text-sm">Seller</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-medium text-gray-700 pl-6 text-sm">Username</TableHead>
                      <TableHead className="font-medium text-gray-700 text-sm">Email</TableHead>
                      <TableHead className="font-medium text-gray-700 text-sm">User Type</TableHead>
                      <TableHead className="font-medium text-gray-700 text-sm text-right pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.map((user) => (
                      <TableRow key={user.username} className="hover:bg-gray-50">
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="font-medium text-gray-900 text-sm">{user.username}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-gray-600 text-sm">
                          {user.email || (
                            <span className="text-gray-400 italic text-sm">No email available</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 text-sm">
                          <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700">
                            {user.type}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6">
                          <button
                            className="flex items-center text-red-600 hover:text-red-800 transition duration-200 ml-auto text-sm"
                            onClick={() => openDeleteDialog(user)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <User className="h-8 w-8 mb-2 text-gray-400" />
                            <p className="text-sm">No users found</p>
                            <p className="text-xs text-gray-400 mt-1">Try a different search term or filter</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="text-sm"
                    >
                      Previous
                    </Button>
                    {getPageNumbers().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-3 py-2">...</span>
                        ) : (
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 p-0 text-sm ${
                              currentPage === page ? 'bg-black text-white hover:bg-black' : ''
                            }`}
                          >
                            {page}
                          </Button>
                        )}
                      </React.Fragment>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="text-sm"
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
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-500 mt-2">
              Are you sure you want to delete user "{userToDelete?.username}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => userToDelete && handleDelete(userToDelete.username, userToDelete.type)}
              className="bg-red-600 hover:bg-red-700 text-sm"
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}