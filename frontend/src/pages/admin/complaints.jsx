
import { getAllComplaints } from "@/pages/admin/services/complaintService.js";
import { useState, useEffect } from "react";
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


export default function ComplaintsPage() {
    const token = localStorage.getItem('token');
    const [sidebarState, setSidebarState] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const { toast } = useToast();
    const toggleSidebar = () => {
        setSidebarState(!sidebarState);
    };

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const data = await getAllComplaints();
                console.log("API Response Data:", data); // Log the structure of the data
                // Ensure data.complaints is an array
                setComplaints(data);
                console.log("Complaints state after fetching:", complaints);
            } catch (error) {
                console.error("Error fetching complaints:", error); // Log error for better debugging
                toast({
                    title: "Error",
                    description: "Failed to load complaints.",
                    duration: 3000,
                });
            }
        };

        fetchComplaints();
    }, [token, toast]); // Add token and toast to the dependency array

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
      <h1 className="text-2xl font-bold mb-4">Complaints Management</h1>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => (window.location.href = "/dashboard")} // Change '/dashboard' to your actual dashboard route
          variant="outline"
        >
          Go to Dashboard
        </Button>
      </div>

      <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint</TableHead>
                    <TableHead>Complaint Details</TableHead>
                    <TableHead>Date Issued</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((complaint) => (
                    <TableRow key={complaint._id}>
                      <TableCell>{complaint.title}</TableCell>
                      <TableCell>{complaint.body}</TableCell>
                      <TableCell>{complaint.date}</TableCell>
                      <TableCell>
                        <span className={` ${complaint.status === 'Pending' ? 'text-red-500' : 'text-green-500'}`}>
                          {complaint.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {complaints.length === 0 && (
                <p className="text-center text-muted-foreground mt-4">
                  No complaints found.
                </p>
              )}
    </div>
    <Footer />
  </div>
</div>
)
}
