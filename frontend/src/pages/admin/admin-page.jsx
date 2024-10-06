// AdminPage.jsx
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // Assuming you want footer in the admin page
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const AdminPage = () => {
  const [sidebarState, setSidebarState] = useState(false);
  const [users, setUsers] = useState([
    { username: "user1", type: "admin" },
    { username: "user2", type: "editor" },
    { username: "user3", type: "viewer" },
  ]);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };

  const handleDelete = (username) => {
    // Update the state to remove the user
    setUsers(users.filter((user) => user.username !== username));

    // Set success message
    setSuccessMessage(`User ${username} deleted successfully!`);

    // Clear the message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar state={sidebarState} toggleSidebar={toggleSidebar} />
      <div style={{ transition: "margin-left 0.3s ease", marginLeft: sidebarState ? "250px" : "0", width: "100%" }}>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Database Users</h1>

          {/* Display success message */}
          {successMessage && (
            <p className="text-green-500 mb-4">{successMessage}</p>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.username}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.username)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {users.length === 0 && (
            <p className="text-center text-muted-foreground mt-4">No users found.</p>
          )}
        </div>
        <Footer /> {/* Include footer if needed */}
      </div>
    </div>
  );
};

export default AdminPage;
