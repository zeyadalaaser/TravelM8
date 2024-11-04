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

export async function placeDetails(id) {
    return (await apiClient.get(`/getPlace/${id}`)).data;
} 

export async function getTags() {
    return (await apiClient.get('preference-tags')).data;
}

export async function getMuseums(query) {
    const searchParams = new URLSearchParams(query);
    searchParams.delete('type');
    
    return (await apiClient.get('filterbyTags?' + searchParams.toString())).data;
}

export async function deleteHistoricalPlaceApi(id)  {
    await apiClient.delete(`/deletePlace/${id}`);
};

// export const createPreferenceTag = async (tagName) => {
//     const response = await axios.post(API_URL, { name: tagName });
//     return response.data;
// };




  