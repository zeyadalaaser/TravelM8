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

export const unflagItinerary = async (itineraryId) => {
  console.log("Unflagging itinerary with ID:", itineraryId);
  const response = await axios.put(
    `${API_BASE_URL}itineraries/${itineraryId}/unflag`
  );
  return response.data;
};

const fetchFlaggedItineraries = async () => {
  try {
    const response = await fetch(
      "http://localhost:5001/api/itineraries/flagged",
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Ensure the token is included
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`Error: ${errorData.message}`);
    }

    const data = await response.json();
    setFlaggedItineraries(data.flaggedItineraries || []);
  } catch (error) {
    console.error("Error fetching flagged itineraries:", error);
  }
};
