export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  labels: Label[];
  subtasks: Subtask[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface UpdateTodoRequest extends Partial<CreateTodoRequest> {
  completed?: boolean;
  status?: 'todo' | 'in-progress' | 'done';
}

export interface TodosResponse {
  todos: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status: number;
}