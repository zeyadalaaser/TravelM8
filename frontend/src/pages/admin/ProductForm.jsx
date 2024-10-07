// ProductForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = ({ productId, onProductSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    quantity: '',
    description: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        const response = await axios.get(`/api/products/${productId}`);
        setFormData(response.data);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (productId) {
        await axios.put(`/api/products/${productId}`, formData);
      } else {
        await axios.post('/api/products', formData);
      }
      onProductSaved();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
      <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
      <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
      <button type="submit">{productId ? 'Update Product' : 'Create Product'}</button>
    </form>
  );
};

export default ProductForm;
