import axios from 'axios';

const api = axios.create({
  baseURL: '/api/ecommerce',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecommerce_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ecommerce_token');
      localStorage.removeItem('ecommerce_user');
      window.location.href = '/ecommerce/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('ecommerce_token', token);
  } else {
    localStorage.removeItem('ecommerce_token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('ecommerce_token');
};

export const setUser = (user: Record<string, unknown> | null) => {
  if (user) {
    localStorage.setItem('ecommerce_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('ecommerce_user');
  }
};

export const getUser = () => {
  const userStr = localStorage.getItem('ecommerce_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
  localStorage.removeItem('ecommerce_token');
  localStorage.removeItem('ecommerce_user');
};
