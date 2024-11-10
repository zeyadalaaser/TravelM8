import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/';
const token = localStorage.getItem('token');

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
});

// Fetch all products with optional query parameters
export async function getProducts(query = '') {
    return (await apiClient.get(`products${query}`)).data;
}


/* export async function getProducts(query) {
  const token = localStorage.getItem('token');

  const searchParams = new URLSearchParams(query);
  searchParams.delete("type");
  
  const response = await apiClient.get("products?" + searchParams.toString(), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }); */



export async function getMyProducts(query = '') {
  const token = localStorage.getItem('token');
  const searchParams = new URLSearchParams(query);
  searchParams.delete("type");
  return (await apiClient.get("products?"+searchParams.toString(),
          {headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }})).data;
}


// Fetch all product categories
export async function getCategories() {
    return (await apiClient.get('activity-categories')).data;
}

export async function fetchProfileInfo(token) {
    return (
        await apiClient.get("sellers/myProfile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      ).data;
}

// Update profile info
export async function updateProfile(updatedData,token) {
    try {
        const response = await apiClient.put("sellers/updateMyProfile", updatedData,
            {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating profile info:', error);
        throw error;
    }
}
export async function changePassword(passwordData,token) {
    return (
      await apiClient.post("sellers/changepassword", passwordData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;
  }
  