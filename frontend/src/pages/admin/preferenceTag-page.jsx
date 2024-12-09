"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search, Tag } from "lucide-react";
import { toast } from "sonner";
import {
  createPreferenceTag,
  getAllPreferenceTags,
  updatePreferenceTag,
  deletePreferenceTag,
} from "@/pages/admin/services/preferenceTagService.js";

const Preferencetag = () => {
  const [sidebarState, setSidebarState] = useState(false);
  const [tags, setTags] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [newTagName, setNewTagName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchTags();
  }, []);

  const fetchTags = async () => {
    const fetchedTags = await getAllPreferenceTags();
    setTags(fetchedTags);
  };

  const handleCreate = async () => {
    if (newTagName.trim() !== "") {
      const newTag = await createPreferenceTag(newTagName.trim());
      setTags((prevTags) => [...prevTags, newTag]);
      setNewTagName("");
      setIsOpen(false);
      toast("Success", {
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
      toast("Success", {
        description: "Tag updated successfully!",
        duration: 3000,
      });
    }
  };

  const handleDelete = async (tagName) => {
    await deletePreferenceTag(tagName);
    setTags((prevTags) => prevTags.filter((tag) => tag.name !== tagName));
    toast("Success", {
      description: "Tag deleted successfully!",
      duration: 3000,
    });
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar state={sidebarState} toggleSidebar={() => setSidebarState(!sidebarState)} />
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
              <h1 className="text-2xl font-bold mt-12">Preference Tags</h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="mb-6 flex justify-between items-center">
                <div className="relative w-1/3">
                  <input
                    type="text"
                    placeholder="Search tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setCurrentTag(null);
                        setNewTagName("");
                      }}
                      className="bg-gray-800"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add New Tag
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">
                        {currentTag ? "Edit Tag" : "Create New Tag"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex items-center gap-4">
                        <Input
                          placeholder="Tag name..."
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={currentTag ? handleUpdate : handleCreate}
                        className="bg-black hover:bg-gray-800"
                      >
                        {currentTag ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {filteredTags.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-600">
                    {searchQuery ? "No tags found matching your search." : "No tags available."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTags.map((tag) => (
                    <div
                      key={tag.name}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Tag className="h-5 w-5 text-gray-500" />
                          </div>
                          <span className="font-medium text-gray-900">{tag.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCurrentTag(tag);
                              setNewTagName(tag.name);
                              setIsOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(tag.name)}
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

export default Preferencetag;
