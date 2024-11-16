import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api"; // Replace with your backend URL

// Fetch all sales data
export const fetchSalesData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sales`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw error;
  }
};

// Fetch filtered sales data
export const fetchFilteredSalesData = async (filter, searchTerm) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sales`, {
      params: { filter, search: searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching filtered sales data:", error);
    throw error;
  }
};
