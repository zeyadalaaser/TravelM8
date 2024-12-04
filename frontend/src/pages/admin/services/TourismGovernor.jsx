import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/NavbarAdmin";
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
import { toast } from "sonner";

const TourismGovernor1 = () => {
  const [sidebarState, setSidebarState] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [governors, setGovernors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch governors when the component mounts
  useEffect(() => {
    fetchGovernors();
  }, []);

  const fetchGovernors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/tourism-governors"
      );
      setGovernors(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (error) {
      console.error("Error fetching tourism governors:", error);
      setError("Failed to fetch tourism governors.");
    }
  };

  const registerGovernor = async () => {
    if (password.length < 7) {
      setError("Password must be at least 7 characters long.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/tourism-governors",
        {
          username,
          password,
        }
      );
      toast(response.data.message, { duration: 3000 });
      fetchGovernors(); // Refresh the governor list after registration
      setUsername("");
      setPassword("");
      setIsOpen(false);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
      toast("Failed to add governor", { duration: 3000 });
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
          <h1 className="text-2xl font-bold mb-4">
            Tourism Governors Management
          </h1>

          <Dialog
            open={isOpen}
            onOpenChange={(open) => {
              setIsOpen(open);
              if (open) {
                setError(null); // Clear any previous error message
                setUsername(""); // Clear previous username
                setPassword(""); // Clear previous password
              }
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Governor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Tourism Governor</DialogTitle>
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
                    minLength={7}
                  />
                </div>
                {error && (
                  <p className="mt-4 text-sm text-red-600 font-medium">
                    {error}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <Button onClick={registerGovernor}>Add Governor</Button>
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
              {governors.map((governor, index) => (
                <TableRow key={index}>
                  <TableCell>{governor.username}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {governors.length === 0 && (
            <p className="text-center text-muted-foreground mt-4">
              No governors found.
            </p>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default TourismGovernor1;
