
import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";


function AddProductForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData ? initialData.name : "",
    description: initialData ? initialData.description : "",
    price: initialData ? initialData.price : "",
    quantity: initialData ? initialData.quantity : "",
    image: initialData ? initialData.image : "",
  });
  const [image, setImage] = useState(null); // to store image file

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // get the file
    setImage(file); // store the file in the state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare form data for submission
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
      image: formData.image
    };

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", productData.name);
    formDataToSubmit.append("description", productData.description);
    formDataToSubmit.append("price", productData.price);
    formDataToSubmit.append("quantity", productData.quantity);
    formDataToSubmit.append("image", productData.image);

    // if (image) {
    //   formDataToSubmit.append("image", image); // append image file to form data
    // }

    // Pass formDataToSubmit to onSubmit function (handleCreateProduct or handleUpdateProduct)
    await onSubmit(formDataToSubmit);

    setIsSubmitting(false);

    if (!initialData) {
      setFormData({
        name: "",
        description: "",
        price: "",
        quantity: "",
        image: "",
      });
      // setImage(null); // clear the selected image
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        quantity: initialData.quantity,
        image: initialData.image,
      });
    }
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="price">Price (USD)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="image">Upload Image</Label>
        <Input id="image" name="image" type="file" accept="image/*" onChange={handleChange}   disabled={isSubmitting} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}
export default AddProductForm;