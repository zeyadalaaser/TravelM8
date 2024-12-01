import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ActivityCategories = () => {
  const [sidebarState, setSidebarState] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5001/api/activity-categories"
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/activity-categories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategoryName }),
        }
      );
      if (response.ok) {
        fetchCategories();
        setIsOpen(false);
        setNewCategoryName("");
        toast({
          title: "Success",
          description: "Category created successfully!",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error creating category.",
        duration: 3000,
      });
    }
  };

  const handleUpdate = async () => {
    if (!currentCategory || !newCategoryName.trim()) return;
    try {
      const response = await fetch(
        "http://localhost:5001/api/activity-categories",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: currentCategory,
            newName: newCategoryName,
          }),
        }
      );
      if (response.ok) {
        fetchCategories();
        setIsOpen(false);
        setCurrentCategory(null);
        setNewCategoryName("");
        toast({
          title: "Success",
          description: "Category updated successfully!",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error updating category.",
        duration: 3000,
      });
    }
  };

  const handleDelete = async (categoryName) => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/activity-categories",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryName }),
        }
      );
      if (response.ok) {
        fetchCategories();
        toast({
          title: "Success",
          description: "Category deleted successfully!",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error deleting category.",
        duration: 3000,
      });
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        state={sidebarState}
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
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">
            Activity Categories Management
          </h1>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setCurrentCategory(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {currentCategory ? "Edit Category" : "Create New Category"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoryName" className="text-right">
                    Category Name
                  </Label>
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={currentCategory ? handleUpdate : handleCreate}>
                  {currentCategory ? "Update" : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.name}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => {
                          setCurrentCategory(category.name);
                          setNewCategoryName(category.name);
                          setIsOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(category.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {categories.length === 0 && !loading && (
            <p className="text-center text-muted-foreground mt-4">
              No categories found.
            </p>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ActivityCategories;
