// src/services/productService.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/products'; // Adjust to your actual product API URL

// Create a new product
const createProduct = async (productData) => {
  const response = await axios.post(API_URL, productData); // Use the base URL for POST
  return response.data;
};

// Get all products
const getAllProducts = async () => {
  const response = await axios.get(API_URL); // Use the base URL for GET
  return response.data;
};

// Delete a product by ID
const deleteProduct = async (productId) => {
    const response = await axios.delete(`${API_URL}/${productId}`); // Use the base URL with ID for DELETE
    return response.data;
}; 
 

const updateProduct = async (productId, updatedData) => {
    try {
      // Send PUT request to update the product
      const response = await axios.put(`${API_URL}/${productId}`, updatedData);
      return response.data; // Return the response data
    } catch (error) {
      throw new Error("Error updating product: " + error.message);
    }
  };

export { getAllProducts, deleteProduct, updateProduct, createProduct};
