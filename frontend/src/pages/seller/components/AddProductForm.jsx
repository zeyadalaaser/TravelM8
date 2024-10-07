import React, { useState } from 'react';
import { Button } from "./button"; // Ensure this is imported correctly
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";

function AddProductForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("productName", formData.productName);
    form.append("description", formData.description);
    form.append("price", formData.price);
    if (formData.image) {
      form.append("image", formData.image);
    }
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="productName">Product Name</Label>
        <Input id="productName" name="productName" value={formData.productName} onChange={handleChange} required disabled={loading} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required disabled={loading} />
      </div>
      <div>
        <Label htmlFor="price">Price (EGP)</Label>
        <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required disabled={loading} />
      </div>
      <div>
        <Label htmlFor="image">Upload Image</Label>
        <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} required disabled={loading} />
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Adding.." : "Add Product"}</Button>
    </form>
  );
}

export default AddProductForm;
