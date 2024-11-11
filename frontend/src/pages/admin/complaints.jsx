import { getAllComplaints, updateComplaintStatusAndReply } from "@/pages/admin/services/complaintService.js";
import { useState, useEffect } from "react";
import useRouter from "@/hooks/useRouter"
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
import { Textarea } from "@/components/ui/textarea";

export default function ComplaintsPage() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log('No token found in local storage');
    return null;
  }

  try {
    // Split the token to get the payload
    const payload = token.split('.')[1]; // Get the second part of the token (the payload)
    
    // Decode the Base64 payload
    const decodedPayload = JSON.parse(atob(payload));
    
    // Access the role
    const role = decodedPayload.role;
    if (role) {
        console.log('User Role:', role);
      }
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
  const [sidebarState, setSidebarState] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState(""); 
  const [reply, setReply] = useState("");
  const { searchParams, navigate, location } = useRouter();

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };

  useEffect(() => {
    fetchComplaints();
  }, [token, toast,searchParams]);



  const fetchComplaints = async () => {
    try {
        const data = await getAllComplaints(token);
        let filteredAndSortedComplaints = [...data];

        // Apply filtering
        const status = searchParams.get('status');
        if (status && status !== 'All') {
            filteredAndSortedComplaints = filteredAndSortedComplaints.filter(
                complaint => complaint.status === status
            );
        }
        // Apply sorting
        const sortBy = searchParams.get('sortBy') || 'date';
        const order = searchParams.get('order') || 'desc';
        filteredAndSortedComplaints.sort((a, b) => {
            if (order === 'asc') {
                return new Date(a[sortBy]) - new Date(b[sortBy]);
            } else {
                return new Date(b[sortBy]) - new Date(a[sortBy]);
            }
        });

        setComplaints(filteredAndSortedComplaints);
        toast({
          title: "Success",
          description: "Success to load complaints.",
          duration: 3000,
      });
    } catch (error) {
        console.error("Error fetching complaints:", error);
        toast({
            title: "Error",
            description: "Failed to load complaints.",
            duration: 3000,
        });
    }
};


    const handleFilter = (status) => {
        searchParams.set('status', status);
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };

    const handleSort = (value) => {
        const [sortBy, order] = value.split('-');
        searchParams.set('sortBy', sortBy);
        searchParams.set('order', order);
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };

    const getSortBy = () => {
        const sortBy = searchParams.get('sortBy') || 'date';
        const order = searchParams.get('order') || 'desc';
        return `${sortBy}-${order}`;
    };

    const getActiveFilter = () => searchParams.get('status') || 'All';


  const handleSubmit = async () => {
    if (selectedComplaint && selectedStatus) {
      try {
        updateComplaintStatusAndReply(token, selectedComplaint._id, reply, selectedStatus); 
        setComplaints(prevComplaints =>
          prevComplaints.map(complaint =>
            complaint._id === selectedComplaint._id
              ? { ...complaint, status: selectedStatus, reply: reply }
              : complaint
          )
        );
        toast({
          title: "Success",
          description: `Complaint status updated to ${selectedStatus}.`,
          duration: 10000,
        });
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
          <div className="flex justify-start mb-4">
          <div className="flex items-center space-x-4">
                            <Select value={getActiveFilter()} onValueChange={handleFilter}>
                                <SelectTrigger className="w-[200px] !ring-0">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">Show All</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-4 ml-4">
                            <Select value={getSortBy()} onValueChange={handleSort}>
                                <SelectTrigger className="w-[200px] !ring-0">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date-desc">Date: Newest First</SelectItem>
                                    <SelectItem value="date-asc">Date: Oldest First</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={() => (window.location.href = "/AdminDashboard")}
                                variant="outline"
                            >
                                Go to Dashboard
                            </Button>
                        </div>
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
          <Textarea 
          value={reply} // Bind the Textarea value to reply state
          onChange={(e) => setReply(e.target.value)} // Update reply state on change
        />
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
