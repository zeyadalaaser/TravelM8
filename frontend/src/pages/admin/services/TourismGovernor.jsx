import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Mail, User, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function TourismGovernor() {
  const [sidebarState, setSidebarState] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [governors, setGovernors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [governorToDelete, setGovernorToDelete] = useState(null);
  const governorsPerPage = 5;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchGovernors();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const fetchGovernors = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/tourism-governors");
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
      const response = await axios.post("http://localhost:5001/api/tourism-governors", {
        username,
        password,
      });
      toast("Success", {
        description: "Governor added successfully.",
        duration: 3000,
      });
      fetchGovernors();
      setUsername("");
      setPassword("");
      setIsOpen(false);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
      toast.error("Failed to add governor");
    }
  };

  const handleDelete = async (username) => {
    try {
      await axios.delete(`http://localhost:5001/api/tourism-governors/${username}`);
      setGovernors(prevGovernors => 
        prevGovernors.filter(governor => governor.username !== username)
      );
      toast("Success", {
        description: "Governor deleted successfully.",
        duration: 3000,
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete governor");
    }
  };

  // Filter and pagination logic
  const filteredGovernors = governors.filter(governor =>
    governor.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastGovernor = currentPage * governorsPerPage;
  const indexOfFirstGovernor = indexOfLastGovernor - governorsPerPage;
  const currentGovernors = filteredGovernors.slice(indexOfFirstGovernor, indexOfLastGovernor);
  const totalPages = Math.ceil(filteredGovernors.length / governorsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        isOpen={sidebarState}
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
        <main className="flex-1 py-16 bg-gray-50"> {/* Consistent top/bottom padding */}
        <div className="container mx-auto p-6 w-4/5">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold mt-12">Tourism Governors Management</h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-1/3">
                  <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gray-800">
                      <UserPlus className="mr-2 h-4 w-4" />
                      New Governor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Add New Tourism Governor</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right text-sm">
                          Username
                        </Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right text-sm">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      {error && (
                        <p className="text-sm text-red-600">{error}</p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button onClick={registerGovernor} className="bg-black hover:bg-gray-800 text-sm">
                        Add Governor
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-medium text-gray-700 pl-6 text-sm">Username</TableHead>
                      <TableHead className="font-medium text-gray-700 text-sm">Email</TableHead>
                      <TableHead className="font-medium text-gray-700 text-sm text-center">Role</TableHead>
                      <TableHead className="font-medium text-gray-700 text-sm text-right pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentGovernors.map((governor) => (
                      <TableRow key={governor.username} className="hover:bg-gray-50">
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="font-medium text-gray-900 text-sm">{governor.username}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-gray-600 text-sm">
                          {governor.email || (
                            <span className="text-gray-400 italic text-sm">No email available</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700">
                            Tourism Governor
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6">
                          <button
                            className="flex items-center text-red-600 hover:text-red-800 transition duration-200 ml-auto text-sm"
                            onClick={() => {
                              setGovernorToDelete(governor);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="text-sm"
                    >
                      Previous
                    </Button>
                    {getPageNumbers().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-3 py-2">...</span>
                        ) : (
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 p-0 text-sm ${
                              currentPage === page ? 'bg-black text-white hover:bg-black' : ''
                            }`}
                          >
                            {page}
                          </Button>
                        )}
                      </React.Fragment>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="text-sm"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-500 mt-2">
              Are you sure you want to delete governor "{governorToDelete?.username}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => governorToDelete && handleDelete(governorToDelete.username)}
              className="bg-red-600 hover:bg-red-700 text-sm"
            >
              Delete Governor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
