import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";
import { UserPlus, Mail, User, Key, Search } from "lucide-react";
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
import { toast } from "sonner";

const AdminPanel = () => {
  const [sidebarState, setSidebarState] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [email, setEmail] = useState("");
  const [admins, setAdmins] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/admins");
      setAdmins(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error("Failed to fetch admins. Please try again.");
    }
  };

  const registerAdmin = async () => {
    if (password.length < 7) {
      toast.error("Password must be at least 7 characters long.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email format.");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/admins/register", 
        { username, password, email }
      );
      fetchAdmins();
      setUsername("");
      setPassword("");
      setEmail("");
      setEmail("");
      setIsOpen(false);
      toast.success("Admin added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const filteredAdmins = admins.filter(admin => 
    admin.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        state={sidebarState}
        toggleSidebar={() => setSidebarState(!sidebarState)}
      />
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={() => setSidebarState(!sidebarState)} />
        
        <main className="flex-1 py-28">
          <div className="container mx-auto p-6 w-4/5">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold">Admin Management</h1>
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
                    <Button className="bg-black hover:bg-gray-800 shadow-sm text-sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      New Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold">Create New Admin Account</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="username"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={registerAdmin} className="bg-black hover:bg-gray-800">
                        Create Admin
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-medium text-gray-700 pl-6 text-sm">Username</TableHead>
                      <TableHead className="font-medium text-gray-700 text-sm">Email</TableHead>
                      <TableHead className="font-medium text-gray-700 text-sm">Status</TableHead>
                      <TableHead className="font-medium text-gray-700 pl-6 text-sm">Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentAdmins.map((admin) => (
                      <TableRow key={admin.username} className="hover:bg-gray-50">
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="font-medium text-gray-900 text-sm">{admin.username}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-gray-600 text-sm">
                          {admin.email || (
                            <span className="text-gray-400 italic text-sm">No email available</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-50 text-green-700">
                            Active
                          </div>
                        </TableCell>
                        <TableCell className="py-4 pl-6">
                          <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700">
                            System Admin
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredAdmins.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <User className="h-8 w-8 mb-2 text-gray-400" />
                            <p className="text-sm">No admins found</p>
                            <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? 'bg-black text-white hover:bg-black' : ''}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
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
    </div>
  );
};

export default AdminPanel;
