import axios, { AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  Todo, 
  TodosResponse,
  CreateTodoRequest,
  UpdateTodoRequest,
  User
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (data: LoginRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/login', data),
  
  register: (data: RegisterRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/register', data),
  
  getProfile: (): Promise<AxiosResponse<User>> =>
    api.get('/auth/profile'),
  
  logout: (): Promise<AxiosResponse<void>> =>
    api.post('/auth/logout'),
};

// Todo endpoints
export const todoAPI = {
  getTodos: (params?: {
    page?: number;
    limit?: number;
    completed?: boolean;
    priority?: string;
    search?: string;
  }): Promise<AxiosResponse<TodosResponse>> =>
    api.get('/todos', { params }),
  
  getTodo: (id: string): Promise<AxiosResponse<Todo>> =>
    api.get(`/todos/${id}`),
  
  createTodo: (data: CreateTodoRequest): Promise<AxiosResponse<Todo>> =>
    api.post('/todos', data),
  
  updateTodo: (id: string, data: UpdateTodoRequest): Promise<AxiosResponse<Todo>> =>
    api.put(`/todos/${id}`, data),
  
  deleteTodo: (id: string): Promise<AxiosResponse<void>> =>
    api.delete(`/todos/${id}`),
  
  toggleTodo: (id: string): Promise<AxiosResponse<Todo>> =>
    api.patch(`/todos/${id}/toggle`),
};

export default api;