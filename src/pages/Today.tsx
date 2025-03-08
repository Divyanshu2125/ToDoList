
import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/store';
import { motion } from 'framer-motion';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import TaskDetailPanel from '../components/TaskDetailPanel';
import { Task } from '../types';

const Today: React.FC = () => {
  const { tasks } = useAppSelector(state => state.tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Filter today's tasks
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  });

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseDetail = () => {
    setSelectedTask(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row gap-4 h-full"
    >
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Today's Tasks</h1>
          <div className="bg-gray-800 text-white dark:bg-todo-darker text-sm px-3 py-1 rounded-full">
            {todayTasks.length}
          </div>
        </div>
        
        <TaskInput />
        <TaskList 
          filter="today" 
          onTaskSelect={handleTaskSelect}
        />
      </div>

      {selectedTask && (
        <div className="w-full md:w-96 border-l dark:border-todo-darkBorder bg-white dark:bg-todo-dark p-4">
          <TaskDetailPanel task={selectedTask} onClose={handleCloseDetail} />
        </div>
      )}
    </motion.div>
  );
};

export default Today;
