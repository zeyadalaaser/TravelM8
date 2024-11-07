'use client'

import React, { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash2, X } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// Mock service functions (replace with actual API calls)
const getDeletionRequests = async () => {
  // Simulated API call
  return [
    { id: 1, username: "tourist1",userType: "Tourist", requestDate: "2024-03-15", reason: "No longer traveling" },
    { id: 2, username: "tourist2", userType: "Tourist",requestDate: "2024-03-16", reason: "Privacy concerns" },
    { id: 3, username: "tourist3", userType: "Advertiser",requestDate: "2024-03-17", reason: "Switching to a different service" },
  ]
}

const deleteAccount = async (id) => {
  // Simulated API call
  console.log(`Deleting account with ID: ${id}`)
  return true
}

const rejectDeletionRequest = async (id) => {
  // Simulated API call
  console.log(`Rejecting deletion request with ID: ${id}`)
  return true
}

export default function AdminDeleteRequests() {
    const [sidebarState, setSidebarState] = useState(false);
    const [requests, setRequests] = useState([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)
    const { toast } = useToast()
  
    useEffect(() => {
      const fetchRequests = async () => {
        try {
          const fetchedRequests = await getDeletionRequests()
          setRequests(fetchedRequests)
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load deletion requests.",
            variant: "destructive",
          })
        }
      }
  
      fetchRequests()
    }, [toast])

    const toggleSidebar = () => {
        setSidebarState(!sidebarState);
      };

    const handleDelete = async (id) => {
      try {
        await deleteAccount(id)
        setRequests(requests.filter(request => request.id !== id))
        toast({
          title: "Success",
          description: "Account deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete account.",
          variant: "destructive",
        })
      }
      setIsDeleteDialogOpen(false)
    }
  
    const handleReject = async (id) => {
      try {
        await rejectDeletionRequest(id)
        setRequests(requests.filter(request => request.id !== id))
        toast({
          title: "Success",
          description: "Deletion request rejected.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to reject deletion request.",
          variant: "destructive",
        })
      }
    }
  
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
      <div className="container mx-auto p-6 bg-background shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-primary"> Account Deletion Requests</h1>
        <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="font-semibold text-muted-foreground">Username</TableHead>
              <TableHead className="font-semibold text-muted-foreground">User Type</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Request Date</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Reason</TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id} className="border-t">
                <TableCell className="font-medium">{request.username}</TableCell>
                <TableCell>{request.userType}</TableCell>
                <TableCell>{request.requestDate}</TableCell>
                <TableCell>{request.reason}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete Account</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this account?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete the
                          account and remove the data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Username
                          </Label>
                          <Input
                            id="username"
                            value={selectedRequest ? selectedRequest.username : ''}
                            className="col-span-3"
                            readOnly
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => selectedRequest && handleDelete(selectedRequest.id)}
                        >
                          Delete Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleReject(request.id)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Reject deletion request</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
        {requests.length === 0 && (
          <p className="text-center text-muted-foreground mt-6 p-4 bg-muted rounded-lg">
            No deletion requests found.
          </p>
        )}
         </div>
         <Footer />
      </div>
      </div>
    )
  }