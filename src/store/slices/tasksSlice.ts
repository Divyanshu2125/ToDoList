
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TasksState } from '../../types';

// Get stored tasks and view mode from localStorage
const storedTasks = localStorage.getItem('tasks');
const storedViewMode = localStorage.getItem('viewMode');

const initialState: TasksState = {
  tasks: storedTasks ? JSON.parse(storedTasks) : [],
  viewMode: (storedViewMode as 'list' | 'card') || 'list',
  loading: false,
  error: null,
  searchQuery: '',
};

// Mock initial tasks if none exist
if (!storedTasks) {
  initialState.tasks = [
    {
      id: '1',
      title: 'Buy groceries',
      completed: false,
      priority: 'medium',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Finish project report',
      completed: false,
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Call the bank',
      completed: false,
      priority: 'low',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Schedule dentist appointment',
      completed: false,
      priority: 'medium',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Plan weekend trip',
      completed: false,
      priority: 'low',
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      title: 'Read a book',
      completed: true,
      priority: 'low',
      createdAt: new Date().toISOString(),
    },
    {
      id: '7',
      title: 'Clean the house',
      completed: true,
      priority: 'medium',
      createdAt: new Date().toISOString(),
    },
    {
      id: '8',
      title: 'Prepare presentation',
      completed: true,
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
    {
      id: '9',
      title: 'Update blog',
      completed: true,
      priority: 'low',
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem('tasks', JSON.stringify(initialState.tasks));
}

// Fetch weather data for outdoor tasks
export const fetchWeatherForTask = createAsyncThunk(
  'tasks/fetchWeatherForTask',
  async (taskId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { tasks: TasksState };
      const task = state.tasks.tasks.find(task => task.id === taskId);
      
      if (!task) {
        return rejectWithValue('Task not found');
      }
      
      // Check if the task title contains outdoor keywords
      const outdoorKeywords = ['outdoor', 'outside', 'park', 'walk', 'run', 'hike', 'bike', 'jog', 'garden', 'trip'];
      const isOutdoorTask = outdoorKeywords.some(keyword => 
        task.title.toLowerCase().includes(keyword)
      );
      
      if (!isOutdoorTask) {
        return { taskId, weather: null };
      }
      
      // Simulate API call to weather service
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock weather data
      const weatherConditions = ['sunny', 'partly cloudy', 'cloudy', 'rainy', 'stormy'];
      const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      const temperature = Math.floor(Math.random() * 30) + 10; // 10-40°C
      
      const weatherData = {
        temperature,
        condition,
        icon: condition === 'sunny' ? '☀️' : 
              condition === 'partly cloudy' ? '⛅' : 
              condition === 'cloudy' ? '☁️' : 
              condition === 'rainy' ? '🌧️' : '⛈️'
      };
      
      return { taskId, weather: weatherData };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch weather data');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    toggleTaskCompletion: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    setTaskPriority: (state, action: PayloadAction<{ id: string; priority: 'high' | 'medium' | 'low' }>) => {
      const task = state.tasks.find(task => task.id === action.payload.id);
      if (task) {
        task.priority = action.payload.priority;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'list' ? 'card' : 'list';
      localStorage.setItem('viewMode', state.viewMode);
    },
    addTaskStep: (state, action: PayloadAction<{ taskId: string; step: { id: string; title: string; completed: boolean } }>) => {
      const task = state.tasks.find(task => task.id === action.payload.taskId);
      if (task) {
        if (!task.steps) {
          task.steps = [];
        }
        task.steps.push(action.payload.step);
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    toggleTaskStep: (state, action: PayloadAction<{ taskId: string; stepId: string }>) => {
      const task = state.tasks.find(task => task.id === action.payload.taskId);
      if (task && task.steps) {
        const step = task.steps.find(step => step.id === action.payload.stepId);
        if (step) {
          step.completed = !step.completed;
          localStorage.setItem('tasks', JSON.stringify(state.tasks));
        }
      }
    },
    setTaskDueDate: (state, action: PayloadAction<{ taskId: string; dueDate: string }>) => {
      const task = state.tasks.find(task => task.id === action.payload.taskId);
      if (task) {
        task.dueDate = action.payload.dueDate;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    setTaskNotes: (state, action: PayloadAction<{ taskId: string; notes: string }>) => {
      const task = state.tasks.find(task => task.id === action.payload.taskId);
      if (task) {
        task.notes = action.payload.notes;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    searchTasks: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherForTask.fulfilled, (state, action) => {
        if (action.payload.weather) {
          const task = state.tasks.find(task => task.id === action.payload.taskId);
          if (task) {
            task.weather = action.payload.weather;
            localStorage.setItem('tasks', JSON.stringify(state.tasks));
          }
        }
      });
  },
});

export const { 
  addTask, 
  toggleTaskCompletion, 
  deleteTask, 
  updateTask, 
  setTaskPriority,
  toggleViewMode,
  addTaskStep,
  toggleTaskStep,
  setTaskDueDate,
  setTaskNotes,
  searchTasks
} = tasksSlice.actions;

export default tasksSlice.reducer;
