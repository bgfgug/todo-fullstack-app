import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Todo, TodosResponse, CreateTodoRequest, UpdateTodoRequest } from '../types';
import { todoAPI } from '../services/api';
import { toast } from 'sonner';

interface TodoState {
  todos: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  filters: {
    completed?: boolean;
    priority?: string;
    search?: string;
  };
}

type TodoAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TODOS'; payload: TodosResponse }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<TodoState['filters']> }
  | { type: 'SET_PAGE'; payload: number };

const initialState: TodoState = {
  todos: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  filters: {},
};

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TODOS':
      return {
        ...state,
        todos: action.payload.todos,
        total: action.payload.total,
        page: action.payload.page,
        limit: action.payload.limit,
        totalPages: action.payload.totalPages,
        loading: false,
      };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [action.payload, ...state.todos],
        total: state.total + 1,
      };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
        total: state.total - 1,
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        page: 1, // Reset to first page when filters change
      };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
};

interface TodoContextType extends TodoState {
  fetchTodos: () => Promise<void>;
  createTodo: (data: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: string, data: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TodoState['filters']>) => void;
  setPage: (page: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider = ({ children }: TodoProviderProps) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const fetchTodos = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await todoAPI.getTodos({
        page: state.page,
        limit: state.limit,
        ...state.filters,
      });
      dispatch({ type: 'SET_TODOS', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.error(error.response?.data?.message || 'Failed to fetch todos');
    }
  };

  const createTodo = async (data: CreateTodoRequest) => {
    try {
      const response = await todoAPI.createTodo(data);
      dispatch({ type: 'ADD_TODO', payload: response.data });
      toast.success('Todo created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create todo');
      throw error;
    }
  };

  const updateTodo = async (id: string, data: UpdateTodoRequest) => {
    try {
      const response = await todoAPI.updateTodo(id, data);
      dispatch({ type: 'UPDATE_TODO', payload: response.data });
      toast.success('Todo updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update todo');
      throw error;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await todoAPI.deleteTodo(id);
      dispatch({ type: 'DELETE_TODO', payload: id });
      toast.success('Todo deleted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete todo');
      throw error;
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const response = await todoAPI.toggleTodo(id);
      dispatch({ type: 'UPDATE_TODO', payload: response.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to toggle todo');
      throw error;
    }
  };

  const setFilters = (filters: Partial<TodoState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setPage = (page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  return (
    <TodoContext.Provider
      value={{
        ...state,
        fetchTodos,
        createTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        setFilters,
        setPage,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};