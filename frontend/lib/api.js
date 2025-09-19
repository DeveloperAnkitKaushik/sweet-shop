import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('token');
            Cookies.remove('user');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
};

// Sweets API
export const sweetsAPI = {
    getAll: (params) => api.get('/sweets', { params }),
    getById: (id) => api.get(`/sweets/${id}`),
    search: (params) => api.get('/sweets/search', { params }),
    create: (sweetData) => api.post('/sweets', sweetData),
    update: (id, sweetData) => api.put(`/sweets/${id}`, sweetData),
    delete: (id) => api.delete(`/sweets/${id}`),
};

// Inventory API
export const inventoryAPI = {
    purchase: (id, quantity) => api.post(`/sweets/${id}/purchase`, { quantity }),
    restock: (id, quantity) => api.post(`/sweets/${id}/restock`, { quantity }),
    getStock: (id) => api.get(`/sweets/${id}/stock`),
    getLowStock: (threshold) => api.get('/sweets/low-stock', { params: { threshold } }),
};

// Cart API
export const cartAPI = {
    get: () => api.get('/cart'),
    add: (sweetId, quantity = 1) => api.post('/cart/add', { sweetId, quantity }),
    update: (sweetId, quantity) => api.post('/cart/update', { sweetId, quantity }),
    remove: (sweetId) => api.delete(`/cart/item/${sweetId}`),
    clear: () => api.delete('/cart/clear'),
};

export default api;
