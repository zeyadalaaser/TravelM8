import React, { useState, useEffect } from "react";
import { 
  X, 
  CheckCircle, 
  FileText, 
  User, 
  Mail, 
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Search
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const PendingUserDocuments = () => {
  const [userDocuments, setUserDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const usersPerPage = 6;

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const filteredUsers = userDocuments.filter(item => {
    const matchesSearch = item.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || item.user.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const toggleCardExpansion = (userId) => {
    setExpandedCards(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  useEffect(() => {
    fetchUserDocuments();
  }, []);

  const fetchUserDocuments = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/pending-user-documents",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data = await response.json();
      setUserDocuments(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleReject = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/pending-users-documents/${userId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        setUserDocuments(
          userDocuments.filter((item) => item.user._id !== userId)
        );
        toast("User rejected");
      } else {
        throw new Error("Failed to delete the user and documents");
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast("There was an issue rejecting the user.");
    }
  };

  const handleApprove = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/approve-user/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        setUserDocuments(
          userDocuments.filter((item) => item.user._id !== userId)
        );
        toast("User approved and moved to the main collection.");
      } else {
        throw new Error("Failed to approve the user");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      toast("There was an issue approving the user.");
    }
  };

  const renderPaginationButtons = () => {
    return (
      <div className="flex justify-center gap-2 mt-6 mb-8">
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
    );
  };

  if (loading) return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="container mx-auto p-6 mt-8 w-4/5">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-lg rounded-lg">
                <CardHeader>
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="container mx-auto p-6 mt-8 w-4/5">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Error: {error}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="container mx-auto p-6 mt-8 w-4/5 mb-20">

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold mt-12">Pending User Verifications</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="mb-6 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by username or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="pl-10 w-full"
                />
              </div>
              <Select
                value={selectedType}
                onValueChange={(value) => {
                  setSelectedType(value);
                  setCurrentPage(1); // Reset to first page on type change
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="tourguide">Tour Guide</SelectItem>
                  <SelectItem value="advertiser">Advertiser</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentUsers.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600">
                  {searchQuery || selectedType !== "all"
                    ? "No users found matching your search criteria."
                    : "No pending user documents found."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {currentUsers.map((item, index) => (
                  <Card key={index} className="shadow-md rounded-lg hover:shadow-lg transition-shadow">
                    <CardHeader className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold flex items-center gap-2">
                            {item.user.username}
                            <BadgeCheck className="w-5 h-5 text-blue-500" />
                          </h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="w-4 h-4 mr-1" />
                            {item.user.email}
                          </div>
                        </div>
                      </div>
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {item.user.type}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <Collapsible
                        open={expandedCards[item.user._id]}
                        onOpenChange={() => toggleCardExpansion(item.user._id)}
                      >
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-md transition-colors">
                          <span className="text-md font-semibold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-500" />
                            Submitted Documents
                          </span>
                          {expandedCards[item.user._id] ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2">
                          {Object.values(item.documents).some(doc => doc) ? (
                            <ul className="space-y-3">
                              {item.documents.image && (
                                <li className="flex items-center">
                                  <a
                                    href={`http://localhost:5001/uploads/${item.documents.image}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Profile Image
                                  </a>
                                </li>
                              )}
                              {item.documents.idpdf && (
                                <li className="flex items-center">
                                  <a
                                    href={`http://localhost:5001/uploads/${item.documents.idpdf}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    ID Document
                                  </a>
                                </li>
                              )}
                              {item.documents.taxpdf && (
                                <li className="flex items-center">
                                  <a
                                    href={`http://localhost:5001/uploads/${item.documents.taxpdf}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Tax Document
                                  </a>
                                </li>
                              )}
                              {item.documents.certificatespdf && (
                                <li className="flex items-center">
                                  <a
                                    href={`http://localhost:5001/uploads/${item.documents.certificatespdf}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Certificates
                                  </a>
                                </li>
                              )}
                            </ul>
                          ) : (
                            <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-md">
                              <AlertCircle className="w-5 h-5" />
                              <span>No documents submitted yet</span>
                            </div>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>

                    <CardFooter className="flex justify-between gap-2 pt-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 h-9 px-3 bg-green-50 text-green-600 border-green-200 hover:bg-green-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"

                          >
                            <div className="flex items-center justify-center w-full">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              <span className="text-sm font-medium">Approve</span>
                            </div>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white rounded-lg shadow-xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-semibold text-green-600">
                              Approve User Application
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600 mt-2">
                              Are you sure you want to approve this user? They will be granted access to the platform and moved to the main users collection.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleApprove(item.user._id)}
                              className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Confirm Approval
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 h-9 px-3 bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-center justify-center w-full">
                              <X className="mr-1 h-4 w-4" />
                              <span className="text-sm font-medium">Reject</span>
                            </div>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white rounded-lg shadow-xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-semibold text-red-600">
                              Reject User Application
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600 mt-2">
                              Are you sure you want to reject this user? This action cannot be undone and the user will need to reapply.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleReject(item.user._id)}
                              className="bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Confirm Rejection
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            
            {filteredUsers.length > usersPerPage && (
              <div className="mt-6">
                {renderPaginationButtons()}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default PendingUserDocuments;
