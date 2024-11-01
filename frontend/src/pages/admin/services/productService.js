import axios from 'axios';

// Adjust to your actual product API URL
const API_URL = 'http://localhost:5001/api/products';

// Function to get the token from local storage or any other storage
const getToken = () => {
  return localStorage.getItem('token'); // Change this line if your token is stored differently
};

// Create a new product
const createProduct = async (productData) => {
  const token = getToken();
  const response = await axios.post(API_URL, productData, {
    headers: {
      Authorization: `Bearer ${token}`, // Include token in the headers
    },
  });
  return response.data;
};

// Get all products
const getAllProducts = async () => {
  const token = getToken();
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`, // Include token in the headers
    },
  });
  return response.data;
};

// Delete a product by ID
const deleteProduct = async (productId) => {
  const token = getToken();
  const response = await axios.delete(`${API_URL}/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Include token in the headers
    },
  });
  return response.data;
};

// Update a product by ID
const updateProduct = async (productId, updatedData) => {
  const token = getToken();
  try {
    const response = await axios.put(`${API_URL}/${productId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in the headers
      },
    });
    return response.data; // Return the response data
  } catch (error) {
    throw new Error("Error updating product: " + error.message);
  }
};

export { getAllProducts, deleteProduct, updateProduct, createProduct };
