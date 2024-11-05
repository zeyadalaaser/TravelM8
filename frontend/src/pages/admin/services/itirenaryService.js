import axios from 'axios';

// Adjust to your actual product API URL
const API_URL = 'http://localhost:5001/api/myItineraries';

// Function to get the token from local storage or any other storage
const getToken = () => {
  return localStorage.getItem('token'); // Change this line if your token is stored differently
};

// Create a new product

// Get all products
const getMyItineraries = async () => {
  const token = getToken();
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`, // Include token in the headers
    },
  });
  return response.data;
};


export {getMyItineraries };
