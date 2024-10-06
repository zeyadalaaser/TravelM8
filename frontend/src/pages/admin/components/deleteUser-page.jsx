// AdminPage.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // Assuming you want footer in the admin page
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import axios from "axios";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarState, setSidebarState] = useState(false);

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/getallusers`);
        setUsers(response.data);
        if (Array.isArray(response.data)) {
            setUsers(response.data);
          } else {
            throw new Error("Expected an array of users");
          }
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (username, type) => {
    setLoading(true);
    try {
      const response = await axios.delete(`/api/users`, {
        params: {
          username,
          type,
        },
      });

      if (response.status === 200) {
        setUsers(users.filter(user => user.username !== username));
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting user");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar state={sidebarState} toggleSidebar={toggleSidebar} />
      <div style={{ transition: "margin-left 0.3s ease", marginLeft: sidebarState ? "250px" : "0", width: "100%" }}>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Database Users</h1>
          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
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
                      onClick={() => handleDelete(user.username, user.type)}
                      disabled={loading} // Disable button when loading
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {users.length === 0 && !loading && ( // Show this only if not loading
            <p className="text-center text-muted-foreground mt-4">No users found.</p>
          )}
        </div>
        <Footer /> {/* Include footer if needed */}
      </div>
    </div>
  );
};

export default AdminPage;
