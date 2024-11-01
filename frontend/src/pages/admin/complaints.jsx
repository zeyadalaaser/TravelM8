import { getAllComplaints, updateComplaintStatus } from "@/pages/admin/services/complaintService.js";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox"

export default function ComplaintsPage() {
  const token = localStorage.getItem("token");
  const [sidebarState, setSidebarState] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState(""); 

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await getAllComplaints();
        setComplaints(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load complaints.",
          duration: 3000,
        });
      }
    };
    fetchComplaints();
  }, [token, toast]);

  const closeDialog = () => {
    setSelectedComplaint(null);
    setSelectedStatus("");
  };

  const handleSubmit = async () => {
    if (selectedComplaint && selectedStatus) {
      try {
        await updateComplaintStatus(selectedComplaint._id, selectedStatus); // Update status in backend
        // Update local state to reflect changes
        setComplaints(prevComplaints =>
          prevComplaints.map(complaint =>
            complaint._id === selectedComplaint._id
              ? { ...complaint, status: selectedStatus }
              : complaint
          )
        );
        toast({
          title: "Success",
          description: `Complaint status updated to ${selectedStatus}.`,
          duration: 3000,
        });
        closeDialog(); // Close the dialog after submission
      } catch (error) {
        console.error("Error updating status:", error);
        toast({
          title: "Error",
          description: "Failed to update complaint status.",
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
          <h1 className="text-2xl font-bold mb-4">Complaints Management</h1>
          <div className="flex justify-end mb-4">
            <Button onClick={() => (window.location.href = "/dashboard")} variant="outline">
              Go to Dashboard
            </Button>
          </div>

          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Complaint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Issued</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint._id}>
                  <TableCell>{complaint.touristId?.username}</TableCell>  
                  <TableCell>{complaint.title}</TableCell>
                  <TableCell>
                    <span className={`${complaint.status === "Pending" ? "text-red-500" : "text-green-500"}`}>
                      {complaint.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(complaint.date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(complaint.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  <TableCell>
                  <Dialog>
      <DialogTrigger asChild>
      <Button onClick={() => { setSelectedComplaint(complaint);setSelectedStatus(complaint.status); }} variant="outline">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}>
            Complaint : {selectedComplaint?.title}
          </DialogTitle>
          <p></p>
          <Separator/>
          <p></p>
          <p><strong>Description : </strong></p>{selectedComplaint?.body}
          <p></p>
          <p><strong>Date Issued :</strong> {selectedComplaint ? new Date(selectedComplaint.date).toLocaleDateString() : ''}</p>
          <p></p>
          <p><strong>Reply to Complaint : </strong></p>
          <Textarea />
          <p></p>
          <p></p>
          <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
            <SelectTrigger>
                <SelectValue placeholder="Theme" />
            </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
            </Select>
        </DialogHeader>
      <DialogClose asChild>
        <Button onClick={handleSubmit} className="mt-4" >
          Submit       
        </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {complaints.length === 0 && (
            <p className="text-center text-muted-foreground mt-4">No complaints found.</p>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
