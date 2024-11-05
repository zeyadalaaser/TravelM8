import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/';

const apiClient = axios.create({
    baseURL: API_BASE_URL
});


export const getActivities = async (query) => {
    const response = await fetch(`API_ENDPOINT${query}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  };

export async function getProducts(query) {
    const searchParams = new URLSearchParams(query);
    searchParams.delete('type');
    
    if (searchParams.has('price'))
    {
        const price = searchParams.get('price').split('-');
        searchParams.set('minPrice', price[0]);
        searchParams.set('maxPrice', price[1]);
        searchParams.delete('price');
    }

    return (await apiClient.get('products?' + searchParams.toString())).data.data;
}

export async function getMuseums(query) {
    const searchParams = new URLSearchParams(query);
    searchParams.delete('type');
    
    return (await apiClient.get('filterbyTags?' + searchParams.toString())).data;
}

export async function getItineraries(query) {
    const searchParams = new URLSearchParams(query);
    searchParams.delete('type');
    
    
    return (await apiClient.get('FilterItineraries?' + searchParams.toString())).data;
}

export async function getCategories() {
    return (await apiClient.get('activity-categories')).data;
}

export async function getTags() {
    return (await apiClient.get('preference-tags')).data;
}

export async function getMyComplaints(token) {
    return (await apiClient.get('complaints/myComplaints', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })).data;
}



export async function submitComplaint(complaintData,token) {
    return (await apiClient.post('complaints', complaintData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })).data;
}

export const getCompletedToursByTourist = async (touristId) => {
    const response = await fetch(`${API_BASE_URL}bookings/completed/${touristId}`); // Correctly formatted URL
    if (!response.ok) {
        throw new Error("Failed to fetch completed tours");
    }
    return await response.json();
};

