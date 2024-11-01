import { getMyComplaints } from "../../api/apiService";
import useRouter from "@/hooks/useRouter";
import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

export function MyComplaintsPage() {

    const token = localStorage.getItem('token');
    const [complaints, setComplaints] = useState([]);
    const { toast } = useToast();
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const data = await getMyComplaints(token);
                console.log("API Response Data:", data); // Log to inspect the structure of data
                setComplaints(Array.isArray(data.complaints) ? data.complaints : []);
            } catch (error) {
                toast({
                    title: "Error",
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
          </div>
        </div>
      );

}