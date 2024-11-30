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
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import {
  getAllUsers,
  deleteUser,
} from "@/pages/admin/services/adminDeleteServices.js"; // Import the service

const DeleteUser = () => {
  const [sidebarState, setSidebarState] = useState(false);
  const [users, setUsers] = useState([]);
  const { toast } = useToast();

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load users.",
          duration: 3000,
        });
      }
    };

    fetchUsers();
  }, []);

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };

  const handleDelete = async (username, userType) => {
    const confirmed = confirm(
      `Are you sure you want to delete user "${username}"?`
    );
    if (confirmed) {
      try {
        await deleteUser(username, userType); // Pass username and userType to delete service
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.username !== username)
        );
        toast({
          title: "Success",
          description: `User "${username}" deleted successfully!`,
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user.",
          duration: 3000,
        });
      }
    }
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
          <h1 className="text-2xl font-bold mb-4">User Management</h1>
          <div className="flex justify-end mb-4"></div>

          <Table className="w-full">
            {" "}
            {/* Added w-full to make the table full width */}
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.username}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell className="text-right">
                    <button
                      className="flex items-center text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(user.username, user.type)} // Pass user type
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {users.length === 0 && (
            <p className="text-center text-muted-foreground mt-4">
              No users found.
            </p>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DeleteUser;
