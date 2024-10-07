// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api', // Adjust the base URL according to your backend server
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally, you can add interceptors for logging or handling errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API call error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
