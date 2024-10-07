import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/';

const apiClient = axios.create({
    baseURL: API_BASE_URL
});

// Fetch all products with optional query parameters
export async function getProducts(query = '') {
    return (await apiClient.get(`products${query}`)).data;
}

// Fetch all product categories
export async function getCategories() {
    return (await apiClient.get('activity-categories')).data; // Keep this unchanged if it is unrelated to products
}
