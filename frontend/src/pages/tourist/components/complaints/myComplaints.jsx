import { getMyComplaints } from "../../api/apiService";
import useRouter from "@/hooks/useRouter";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator";
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
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";


export function MyComplaintsPage({ onComplaintClick}) {
    const [reply, setReply] = useState("");
    const token = localStorage.getItem('token');
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(""); 
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const data = await getMyComplaints(token);
                console.log("API Response Data:", data); // Log to inspect the structure of data
                setComplaints(Array.isArray(data.complaints) ? data.complaints : []);
            } catch (error) {
                toast("Error", {
                    description: "Failed to load complaints.",
                    duration: 3000,
                });
                setComplaints([]); // Set to an empty array on error
            }
        };
        fetchComplaints();
    }, []);
    
    return (
        <div className="flex w-full">
          <div className="w-full">
            <div className="w-full mx-auto p-4">
              <h1 className="text-2xl font-bold mb-4">My Complaints</h1>              
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint</TableHead>
                    <TableHead>Complaint Details</TableHead>
                    <TableHead>Date Issued</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reply</TableHead>
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
          <p><strong>Complaint Details : </strong></p>{selectedComplaint?.body}
          <p></p>
          <p><strong>Date Issued :</strong> {selectedComplaint ? new Date(selectedComplaint.date).toLocaleDateString() : ''}</p>
          <p></p>
          <p><strong>Reply to Complaint : </strong></p>{selectedComplaint?.reply}
          
          <p></p>
          <p></p>
          
        </DialogHeader>
      <DialogClose asChild>
       
     
        </DialogClose>
      </DialogContent>
    </Dialog>






                     </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex mt-6 justify-end">
                  <Button
                    variant="ghost"
                    className="rounded-full py-2 px-6 bg-red-500 text-white hover:bg-red-600 hover:text-white border-[1px] border-red-600 shadow-sm"
                    onClick={onComplaintClick} // Trigger the complaint form
                  >
                    File a Complaint
                  </Button>
                </div>
              {complaints.length === 0 && (
                <p className="text-center text-muted-foreground mt-4">
                  No complaints found.
                </p>
              )}
            </div>
          </div>
        </div>
      );

}