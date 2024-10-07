import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/';

const apiClient = axios.create({
    baseURL: API_BASE_URL
});

export async function getActivities(query) {
    const searchParams = new URLSearchParams(query);
    searchParams.delete("type");
    return (await apiClient.get('activities?' + searchParams.toString())).data;
}

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