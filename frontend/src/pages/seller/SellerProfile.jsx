"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { PackageSearch } from "lucide-react"; 
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "./components/useToast";

export default function SellerProfile() {
  const [seller, setSeller] = useState({
    name: "Jane Smith",
    description: "Passionate seller with extensive market experience",
    email: "jane.smith@example.com",
    phoneNumber: "123-456-7890",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleUpdateSeller = async (updatedData) => {
    setLoading(true);
    console.log("Attempting to update with data:", updatedData);
    try {
      const response = await fetch(`/api/seller/${seller.name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedSeller = await response.json();
      console.log("Received updated seller:", updatedSeller);
      setSeller(updatedSeller);
      setIsEditModalOpen(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (newProduct) => {
    //logic to add new product TBC

    console.log("Adding new product:", newProduct)
    //API call to handle response here TBC

    setIsAddProductModalOpen(false)
    toast({
      title: "Product Added",
      description: "Your product has been successfully added"
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Profile</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="col-span-1">
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Seller" />
                <AvatarFallback>{seller.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4 text-2xl">{seller.name}</CardTitle>
              <p className="text-muted-foreground">Seller Details</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{seller.email}</p>
              <p className="text-muted-foreground">{seller.phoneNumber}</p>
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <EditProfileForm seller={seller} onSubmit={handleUpdateSeller} loading={loading} />
                </DialogContent>
              </Dialog>
              <br></br>
              <Dialog open={isAddProductModalOpen} onOpenChange={setIsAddProductModalOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4">Add Product</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <AddProductForm onSubmit={handleAddProduct} loading={loading} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          <Button className="mt-4 flex items-center"> <PackageSearch className="mr-2" />View Products</Button>
        </div>
      </div>
    </div>
  );
}

function EditProfileForm({ seller, onSubmit, loading }) {
  const [formData, setFormData] = useState(seller);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={loading} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required disabled={loading} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={loading} />
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required disabled={loading} />
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Profile"}</Button>
    </form>
  );
}


function AddProductForm({ onSubmit, loading}) {
  const [formData, setFormData] = useState({
 productName: "",
 description: "",
 price: "",
 image: null

  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({ ...prev, [name]: value}))
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0]}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Addign product:", formData)


  const form = new FormData();
  form.append("productName", formData.productName)
  form.append("description", formData.description)
  form.append("price", formData.price)
  if(formData.image){
    form.append("image", formData.image)
  }
await onSubmit(form);

};


  return(
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="productName">Product Name</Label>
        <Input id="productName" name="productName" value={formData.productName} onChange={handleChange} required disabled={loading} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" value={formData.description} onChange={handleChange} required disabled={loading} />
      </div>
      <div>
        <Label htmlFor="price">Price (EGP)</Label>
        <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required disabled={loading} />
      </div>
      <div>
        <Label htmlFor="image">Upload Image</Label>
        <Input id="image" name="image" type="file" accept="image/*"  onChange={handleImageChange} required disabled={loading} />
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Adding.." : "Add Product"}</Button>
    </form>
  )


}