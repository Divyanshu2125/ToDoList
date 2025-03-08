
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  dueDate?: string;
  weather?: {
    temperature?: number;
    condition?: string;
    icon?: string;
  };
  notes?: string;
  steps?: { id: string; title: string; completed: boolean }[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface TasksState {
  tasks: Task[];
  viewMode: 'list' | 'card';
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

export interface WeatherState {
  current: {
    temperature?: number;
    condition?: string;
    icon?: string;
  };
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  tasks: TasksState;
  weather: WeatherState;
}
