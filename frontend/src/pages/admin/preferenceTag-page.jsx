import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
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
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  createPreferenceTag,
  getAllPreferenceTags,
  updatePreferenceTag,
  deletePreferenceTag,
} from "@/services/preferenceTagService"; // Import the service

const Preferencetag = () => {
  const [sidebarState, setSidebarState] = useState(false);
  const [tags, setTags] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [newTagName, setNewTagName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchTags = async () => {
      const fetchedTags = await getAllPreferenceTags();
      setTags(fetchedTags);
    };

    fetchTags();
  }, []);

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };

  const handleCreate = async () => {
    if (newTagName.trim() !== "") {
      const newTag = await createPreferenceTag(newTagName.trim());
      setTags((prevTags) => [...prevTags, newTag]);
      setNewTagName("");
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Tag created successfully!",
        duration: 3000,
      });
    }
  };

  const handleUpdate = async () => {
    if (currentTag && newTagName.trim() !== "") {
      const updatedTag = await updatePreferenceTag(currentTag.name, newTagName.trim());
      setTags((prevTags) =>
        prevTags.map((tag) => (tag.name === currentTag.name ? updatedTag : tag))
      );
      setNewTagName("");
      setCurrentTag(null);
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Tag updated successfully!",
        duration: 3000,
      });
    }
  };

  const handleDelete = async (tagName) => {
    await deletePreferenceTag(tagName);
    setTags((prevTags) => prevTags.filter((tag) => tag.name !== tagName));
    toast({
      title: "Success",
      description: "Tag deleted successfully!",
      duration: 3000,
    });
  };

  const openEditModal = (tag) => {
    setCurrentTag(tag);
    setNewTagName(tag.name);
    setIsOpen(true);
  };

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
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Vacation Preference Tags</h1>

          {/* Dashboard Button */}
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => (window.location.href = "/dashboard")} // Change '/dashboard' to your actual dashboard route
              variant="outline"
            >
              Go to Dashboard
            </Button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setCurrentTag(null);
                    setNewTagName("");
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add New Tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {currentTag ? "Edit Tag" : "Create New Tag"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tagName" className="text-right">
                      Tag Name
                    </Label>
                    <Input
                      id="tagName"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={currentTag ? handleUpdate : handleCreate}>
                    {currentTag ? "Update" : "Create"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => openEditModal(tag)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(tag.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {tags.length === 0 && (
            <p className="text-center text-muted-foreground mt-4">
              No tags found.
            </p>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Preferencetag;