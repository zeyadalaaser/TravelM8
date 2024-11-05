// adminItineraryService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/";
const getToken = () => localStorage.getItem("token"); // Adjust if token is stored differently

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Fetch all itineraries including flagged ones (only for admin)
export const getAllItineraries = async (query = "") => {
  const response = await apiClient.get(`itineraries?${query}`);
  return response.data;
};

// Flag an itinerary as inappropriate
export const flagItinerary = async (itineraryId) => {
  console.log("hiii222");
  const response = await axios.put(
    `${API_BASE_URL}itineraries/${itineraryId}/flag`
  );
  return response.data;
};
