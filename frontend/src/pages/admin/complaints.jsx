import {
  getAllComplaints,
  updateComplaintStatusAndReply,
} from "@/pages/admin/services/complaintService.js";
import { useState, useEffect } from "react";
import useRouter from "@/hooks/useRouter";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/NavbarAdmin";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { User as UserIcon } from "lucide-react";

export default function ComplaintsPage() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found in local storage");
    return null;
  }

  try {
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    const role = decodedPayload.role;
    if (role) {
      console.log("User Role:", role);
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }

  const [sidebarState, setSidebarState] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [reply, setReply] = useState("");
  const { searchParams, navigate, location } = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [token, toast, searchParams, selectedDate]); // Added selectedDate here

  const fetchComplaints = async () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const data = await getAllComplaints(token);
      let filteredAndSortedComplaints = [...data];

      const status = searchParams.get("status");
      if (status && status !== "All") {
        filteredAndSortedComplaints = filteredAndSortedComplaints.filter(
          (complaint) => complaint.status === status
        );
      }

      if (selectedDate) {
        filteredAndSortedComplaints = filteredAndSortedComplaints.filter(
          (complaint) =>
            new Date(complaint.date).toLocaleDateString() ===
            new Date(selectedDate).toLocaleDateString()
        );
      }

      const sortBy = searchParams.get("sortBy") || "date";
      const order = searchParams.get("order") || "desc";
      filteredAndSortedComplaints.sort((a, b) => {
        if (order === "asc") {
          return new Date(a[sortBy]) - new Date(b[sortBy]);
        } else {
          return new Date(b[sortBy]) - new Date(a[sortBy]);
        }
      });

      setComplaints(filteredAndSortedComplaints);
      toast("Success", {
        description: "Success to load complaints.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast("Error", {
        description: "Failed to load complaints.",
        duration: 3000,
      });
    }
  };

  const handleFilter = (status) => {
    searchParams.set("status", status);
    if (selectedDate) searchParams.set("date", selectedDate); // Update date in search params
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  const handleSort = (value) => {
    const [sortBy, order] = value.split("-");
    searchParams.set("sortBy", sortBy);
    searchParams.set("order", order);
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  const getSortBy = () => {
    const sortBy = searchParams.get("sortBy") || "date";
    const order = searchParams.get("order") || "desc";
    return `${sortBy}-${order}`;
  };

  const getActiveFilter = () => searchParams.get("status") || "All";

  const handleSubmit = async () => {
    if (selectedComplaint && selectedStatus) {
      try {
        await updateComplaintStatusAndReply(
          token,
          selectedComplaint._id,
          reply,
          selectedStatus
        );
        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint._id === selectedComplaint._id
              ? { ...complaint, status: selectedStatus, reply: reply }
              : complaint
          )
        );
        toast("Success", {
          description: `Complaint status updated to ${selectedStatus}.`,
          duration: 10000,
        });
        // Reset form and close dialog
        setSelectedComplaint(null);
        setSelectedStatus("");
        setReply("");
        setIsOpen(false);
      } catch (error) {
        console.error("Error updating status:", error);
        toast("Error", {
          description: "Failed to update complaint status.",
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar state={sidebarState} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 py-16 bg-gray-50"> {/* Consistent top/bottom padding */}
        <div className="container mx-auto p-6 w-4/5">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold mt-12">Complaints Management</h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Select value={getActiveFilter()} onValueChange={handleFilter}>
                    <SelectTrigger className="w-[180px] text-sm">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All" className="text-sm">Show All</SelectItem>
                      <SelectItem value="Pending" className="text-sm">Pending</SelectItem>
                      <SelectItem value="Resolved" className="text-sm">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-4">
                  <Select value={getSortBy()} onValueChange={handleSort}>
                    <SelectTrigger className="w-[180px] text-sm">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc" className="text-sm">Date: Newest First</SelectItem>
                      <SelectItem value="date-asc" className="text-sm">Date: Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      handleFilter(getActiveFilter());
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {complaints.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-600">
                    No complaints found matching your criteria.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-medium text-gray-700 pl-6 text-sm">Username</TableHead>
                        <TableHead className="font-medium text-gray-700 text-sm">Complaint</TableHead>
                        <TableHead className="font-medium text-gray-700 text-sm text-center">Status</TableHead>
                        <TableHead className="font-medium text-gray-700 text-sm text-center">Date Issued</TableHead>
                        <TableHead className="font-medium text-gray-700 text-sm text-center">Time</TableHead>
                        <TableHead className="font-medium text-gray-700 text-sm text-right pr-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complaints.map((complaint) => (
                        <TableRow key={complaint._id} className="hover:bg-gray-50">
                          <TableCell className="py-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <UserIcon className="h-4 w-4 text-gray-500" />
                              </div>
                              <span className="font-medium text-gray-900 text-sm">
                                {complaint.touristId?.username}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{complaint.title}</TableCell>
                          <TableCell className="text-center">
                            <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium
                              ${complaint.status === "Pending" 
                                ? "bg-yellow-100 text-yellow-800" 
                                : "bg-green-100 text-green-800"}`}>
                              {complaint.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-center text-sm text-gray-600">
                            {new Date(complaint.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-center text-sm text-gray-600">
                            {new Date(complaint.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => {
                                    setSelectedComplaint(complaint);
                                    setSelectedStatus(complaint.status);
                                    setReply(complaint.reply || "");
                                    setIsOpen(true);
                                  }}
                                  variant="outline"
                                  className="text-sm"
                                >
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold text-center">
                                    Complaint Details
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="mt-4">
                                  <h3 className="font-semibold mb-2">{selectedComplaint?.title}</h3>
                                  <p className="text-sm text-gray-600 mb-4">{selectedComplaint?.body}</p>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">Status</label>
                                      <Select
                                        value={selectedStatus}
                                        onValueChange={setSelectedStatus}
                                      >
                                        <SelectTrigger className="w-full mt-1">
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Resolved">Resolved</SelectItem>
                                          <SelectItem value="Pending">Pending</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Reply</label>
                                      <Textarea
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                        className="mt-1"
                                        placeholder="Enter your reply..."
                                      />
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter className="mt-6">
                                  <Button
                                    onClick={handleSubmit}
                                    className="w-full bg-black hover:bg-gray-800"
                                  >
                                    Submit Response
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
