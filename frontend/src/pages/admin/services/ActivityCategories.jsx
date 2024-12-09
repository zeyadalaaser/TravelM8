import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search, Bike, Tent, Mountain, Waves, Coffee, Camera, Map } from "lucide-react";
import { toast } from "sonner";

const ActivityCategories = () => {
  const [sidebarState, setSidebarState] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Icon mapping for different categories
  const categoryIcons = {
    "Biking": Bike,
    "Camping": Tent,
    "Hiking": Mountain,
    "Water Sports": Waves,
    "Cafe Hopping": Coffee,
    "Photography": Camera,
    "default": Map
  };

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
      toast("Error", {
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
        toast("Success", {
          description: "Category created successfully!",
          duration: 3000,
        });
      }
    } catch (error) {
      toast("Error", {
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
        toast("Success", {
          description: "Category updated successfully!",
          duration: 3000,
        });
      }
    } catch (error) {
      toast("Error", {
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
        toast("Success", {
          description: "Category deleted successfully!",
          duration: 3000,
        });
      }
    } catch (error) {
      toast("Error", {
        description: "Error deleting category.",
        duration: 3000,
      });
    }
  };

  const getIconForCategory = (categoryName) => {
    const IconComponent = categoryIcons[categoryName] || categoryIcons.default;
    return <IconComponent className="h-5 w-5" />;
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <h1 className="text-2xl font-bold mt-12">Activity Categories</h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="mb-6 flex justify-between items-center">
                <div className="relative w-1/3">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setCurrentCategory(null)} className="bg-gray-800">
                      <Plus className="mr-2 h-4 w-4" /> Add New Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">
                        {currentCategory ? "Edit Category" : "Create New Category"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex items-center gap-4">
                        <Input
                          placeholder="Category name..."
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={currentCategory ? handleUpdate : handleCreate} className="bg-black hover:bg-gray-800">
                        {currentCategory ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-600">
                    {searchQuery ? "No categories found matching your search." : "No categories available."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCategories.map((category) => (
                    <div
                      key={category.name}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {getIconForCategory(category.name)}
                          </div>
                          <span className="font-medium text-gray-900">{category.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCurrentCategory(category.name);
                              setNewCategoryName(category.name);
                              setIsOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.name)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ActivityCategories;
