import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/';

const apiClient = axios.create({
    baseURL: API_BASE_URL
});


export async function getMyPlaces(token) {
    return (await apiClient.get('myPlaces', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })).data;
}



export async function postPlace(token,place) {
    await apiClient.post('addPlace', place, {
        headers: { Authorization: `Bearer ${token}` },
    });
} 

export async function updatePlace(token,id,place) {
    await apiClient.put(`updatePlace/${id}`, place, {
        headers: { Authorization: `Bearer ${token}` },
      });
} 

export async function changePassword(passwordData, token) {
    return (
      await apiClient.post("tourism-governors/changepassword", passwordData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;
  }

export async function placeDetails(id) {
    return (await apiClient.get(`/getPlace/${id}`)).data;
} 

export async function getTags() {
    return (await apiClient.get('placetag')).data;
}

export async function getMuseums(query) {
    const searchParams = new URLSearchParams(query);
    searchParams.delete('type');
    
    return (await apiClient.get('filterbyTags?' + searchParams.toString())).data;
}

export async function deleteHistoricalPlaceApi(id)  {
    await apiClient.delete(`/deletePlace/${id}`);
};

export const createPlaceTag = async (placeTag) => {
    return (await apiClient.post(`placetag`,placeTag)).data;
};




  