import React, { useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Search } from "lucide-react";
import { deleteUserByUsername } from "@/services/adminDeleteServices"; // Import the service

const DeleteUser = () => {
  const initialUsers = [
    { username: "john_doe", type: "Admin" },
    { username: "jane_smith", type: "Tourist" },
    { username: "alex_brown", type: "Tourism Governor" },
    { username: "mary_jane", type: "Seller" },
    { username: "peter_parker", type: "Tour Guide" },
    // Add more users as needed
  ];

  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarState, setSidebarState] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(""); // State for selected user type

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };

  // Delete user function
  const handleDelete = async (username, type) => {
    setLoading(true);
    try {
      const message = await deleteUserByUsername(username, type); // Call the service
      setUsers(users.filter(user => user.username !== username)); // Remove user from the list
      alert(message); // Alert success message
    } catch (error) {
      setError(error); // Set error if deletion fails
      setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
    } finally {
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value); // Update search term
  }, []);

  // Handle user type selection
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value); // Update selected user type
  };

  // Submit search and deletion
  const handleSearchSubmit = async () => {
    console.log(`Searching for User: ${searchTerm}, Type: ${selectedType}`);
    const userToDelete = users.find(user => 
      user.username.toLowerCase() === searchTerm.toLowerCase() && 
      user.type === selectedType
    );
    
    if (userToDelete) {
      console.log(`User found: ${userToDelete.username}, Type: ${userToDelete.type}`);
      await handleDelete(userToDelete.username, userToDelete.type); // Pass the user type for deletion
      setSearchTerm(""); // Clear the search term after delete
      setSelectedType(""); // Clear selected type after delete
    } else {
      console.log("User not found in the list");
      setError("User not found"); // Handle user not found error
      setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
    }
  };

  // Handle key down for Enter key submission
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit(); // Submit on Enter key press
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar state={sidebarState} toggleSidebar={toggleSidebar} />
      <div style={{ transition: "margin-left 0.3s ease", marginLeft: sidebarState ? "250px" : "0", width: "100%" }}>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Database Users</h1>
          <div className="mb-4 relative flex">
            <Input
              type="text"
              placeholder="Search username..."
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              className="pl-10 h-12 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select 
              value={selectedType} 
              onChange={handleTypeChange} 
              className="ml-2 h-12 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="Admin">Admin</option>
              <option value="Tourist">Tourist</option>
              <option value="Tourism Governor">Tourism Governor</option>
              <option value="Seller">Seller</option>
              <option value="Tour Guide">Tour Guide</option>
            </select>
            <Button 
              onClick={handleSearchSubmit} 
              className="ml-2 h-12 text-lg"
            >
              Delete
            </Button>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.username}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.username, user.type)} // Pass user type for direct delete
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {users.length === 0 && !loading && (
            <p className="text-center text-muted-foreground mt-4">No users found.</p>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DeleteUser;
