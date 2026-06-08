import axios from 'axios';
import type { Product, LoginPayload, AuthToken, User } from '@/types';

const instance = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
});

// Request interceptor：自動帶 token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('vue3shop_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor：統一處理 401
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vue3shop_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const api = {
  products: {
    getAll: () => instance.get<Product[]>('/products').then((r) => r.data),
    getById: (id: number) =>
      instance.get<Product>(`/products/${id}`).then((r) => r.data),
    getCategories: () =>
      instance.get<string[]>('/products/categories').then((r) => r.data),
    getByCategory: (category: string) =>
      instance
        .get<Product[]>(`/products/category/${encodeURIComponent(category)}`)
        .then((r) => r.data),
  },
  auth: {
    login: (payload: LoginPayload) =>
      instance.post<AuthToken>('/auth/login', payload).then((r) => r.data),
  },
  users: {
    getById: (id: number) =>
      instance.get<User>(`/users/${id}`).then((r) => r.data),
  },
};
