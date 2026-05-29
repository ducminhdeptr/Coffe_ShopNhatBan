// ===== API Service Layer =====
import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
});

// JWT Token interceptor
api.interceptors.request.use(config => {
    const token = localStorage.getItem('cafe_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for auth errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('cafe_token');
            localStorage.removeItem('cafe_user');
            if (window.location.pathname.includes('admin')) {
                window.location.href = '/login.html';
            }
        }
        return Promise.reject(error);
    }
);

// ===== Auth =====
export const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    return res.data;
};

// ===== Products =====
export const getProducts = async () => {
    const res = await api.get('/products');
    return res.data;
};

export const getProductById = async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
};

export const getProductsByCategory = async (categoryId) => {
    const res = await api.get(`/products/category/${categoryId}`);
    return res.data;
};

export const createProduct = async (product) => {
    const res = await api.post('/products', product);
    return res.data;
};

export const updateProduct = async (id, product) => {
    const res = await api.put(`/products/${id}`, product);
    return res.data;
};

export const deleteProduct = async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
};

// ===== Categories =====
export const getCategories = async () => {
    const res = await api.get('/categories');
    return res.data;
};

// ===== Orders =====
export const getOrders = async () => {
    const res = await api.get('/orders');
    return res.data;
};

export const createOrder = async (items) => {
    const res = await api.post('/orders', { items });
    return res.data;
};

export const getRevenue = async () => {
    const res = await api.get('/orders/revenue');
    return res.data;
};

// ===== Forecast =====
export const getForecast = async () => {
    const res = await api.get('/forecast');
    return res.data;
};

export default api;
