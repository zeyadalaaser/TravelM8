import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react"; // Removed Trash2 as per previous instructions
import { useToast } from "@/components/ui/use-toast";

const AdminPanel = () => {
  const [sidebarState, setSidebarState] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [admins, setAdmins] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/admins");
      setAdmins(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError("Failed to fetch admins. Please try again.");
    }
  };

  const registerAdmin = async () => {
    if (password.length < 7) {
      setError("Password must be at least 7 characters long.");
      setSuccess(null);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/admins/register",
        { username, password }
      );
      setSuccess(response.data.message);
      setError(null);
      fetchAdmins();
      setUsername("");
      setPassword("");
      setIsOpen(false);
      toast({ title: "Admin added successfully!", duration: 3000 });
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      setSuccess(null);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        state={sidebarState}
        toggleSidebar={() => setSidebarState(!sidebarState)}
      />
      <div
        style={{
          transition: "margin-left 0.3s ease",
          marginLeft: sidebarState ? "250px" : "0",
          width: "100%",
        }}
      >
        <Navbar toggleSidebar={() => setSidebarState(!sidebarState)} />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Admin Management</h1>

          <Dialog
            open={isOpen}
            onOpenChange={(open) => {
              setIsOpen(open);
              if (open) {
                setError(null); // Clear any previous error message
                setSuccess(null); // Clear any previous success message
                setUsername(""); // Clear previous username
                setPassword(""); // Clear previous password
              }
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Create Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="col-span-3"
                    required
                    minLength={7} // Enforce password length on frontend
                  />
                </div>
                {error && (
                  <p className="mt-4 text-sm text-red-600 font-medium">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="mt-4 text-sm text-green-600 font-medium">
                    {success}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <Button onClick={registerAdmin}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.username}>
                  <TableCell>{admin.username}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {admins.length === 0 && (
            <p className="text-center text-muted-foreground mt-4">
              No admins found.
            </p>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AdminPanel;
