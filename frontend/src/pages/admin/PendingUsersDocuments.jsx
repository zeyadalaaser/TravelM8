import React, { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
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

const PendingUserDocuments = () => {
  const [userDocuments, setUserDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Navbar />
        <div className="container mx-auto p-6  mt-8 w-4/5">
          {userDocuments.length === 0 ? (
            <p>No pending user documents found.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {userDocuments.map((item, index) => (
                <Card key={index} className="shadow-lg rounded-lg">
                  <CardHeader className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">
                        {item.user.username}
                      </h3>
                      <p className="text-sm text-gray-500">{item.user.email}</p>
                      <p className="text-sm font-medium text-blue-600">
                        {item.user.type}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-md font-semibold mb-3">
                      Uploaded Documents
                    </h4>
                    <ul className="space-y-2">
                      {item.documents.image && (
                        <li>
                          <a
                            href={`http://localhost:5001/uploads/${item.documents.image}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Image
                          </a>
                        </li>
                      )}
                      {item.documents.idpdf && (
                        <li>
                          <a
                            href={`http://localhost:5001/uploads/${item.documents.idpdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View ID PDF
                          </a>
                        </li>
                      )}
                      {item.documents.taxpdf && (
                        <li>
                          <a
                            href={`http://localhost:5001/uploads/${item.documents.taxpdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Tax PDF
                          </a>
                        </li>
                      )}
                      {item.documents.certificatespdf && (
                        <li>
                          <a
                            href={`http://localhost:5001/uploads/${item.documents.certificatespdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Certificates PDF
                          </a>
                        </li>
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      className="w-full mr-2 text-green-600"
                      onClick={() => handleApprove(item.user._id)}
                    >
                      <CheckCircle className="mr-2" size={16} /> Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600"
                      onClick={() => handleReject(item.user._id)}
                    >
                      <X className="mr-2" size={16} /> Reject
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default PendingUserDocuments;
