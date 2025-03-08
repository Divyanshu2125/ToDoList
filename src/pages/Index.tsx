
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/store';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import { fetchCurrentWeather } from '../store/slices/weatherSlice';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { current, loading } = useAppSelector(state => state.weather);
  
  useEffect(() => {
    // Fetch weather on component mount
    dispatch(fetchCurrentWeather());
    
    // Refresh weather every 30 minutes
    const interval = setInterval(() => {
      dispatch(fetchCurrentWeather());
    }, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">All Tasks</h1>
        
        {!loading && current.condition && (
          <div className="flex items-center gap-2 text-sm bg-white dark:bg-todo-darker px-3 py-1 rounded-full shadow-sm">
            <span className="text-xl">
              {current.icon || 
               (current.condition === 'sunny' ? '☀️' : 
               current.condition === 'partly cloudy' ? '⛅' : 
               current.condition === 'cloudy' ? '☁️' : 
               current.condition === 'rainy' ? '🌧️' : '⛈️')}
            </span>
            <span className="dark:text-gray-300">{current.temperature}°C</span>
          </div>
        )}
      </div>
      
      <TaskInput />
      <TaskList />
    </motion.div>
  );
};

export default Index;
