import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, Check, Cloud, Sun, Umbrella, Clock } from 'lucide-react';
import { toggleTaskCompletion, deleteTask, setTaskPriority, fetchWeatherForTask } from '../store/slices/tasksSlice';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { format } from 'date-fns';
import { Task } from '../types';
import TaskDetail from './TaskDetail';
import { toast } from '../hooks/use-toast';

interface TaskItemProps {
  task: Task;
  filter?: string;
  onSelect?: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, filter, onSelect }) => {
  const dispatch = useAppDispatch();
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const handleToggleCompletion = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleTaskCompletion(task.id));
    toast({
      title: task.completed ? "Task marked as incomplete" : "Task completed",
      description: task.title,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteTask(task.id));
    toast({
      title: "Task deleted",
      description: task.title,
      variant: "destructive",
    });
  };

  const handleTogglePriority = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newPriority = task.priority === 'high' ? 'low' : 'high';
    dispatch(setTaskPriority({ id: task.id, priority: newPriority }));
    toast({
      title: `Task priority set to ${newPriority}`,
      description: task.title,
    });
  };

  const handleTaskClick = () => {
    if (onSelect) {
      onSelect(task);
    } else {
      setIsDetailOpen(true);
    }
  };

  const priorityStyles = {
    low: 'bg-green-50 border-l-4 border-l-green-400',
    medium: 'bg-yellow-50 border-l-4 border-l-yellow-400',
    high: 'bg-red-50 border-l-4 border-l-red-400',
  };
  
  useEffect(() => {
    if (task.title.toLowerCase().includes('outside') || 
        task.title.toLowerCase().includes('walk') || 
        task.title.toLowerCase().includes('trip')) {
      dispatch(fetchWeatherForTask(task.id));
    }
  }, [dispatch, task.id, task.title]);

  const getWeatherIcon = () => {
    if (!task.weather) return null;
    
    const condition = task.weather.condition;
    if (!condition) return null;
    
    if (condition.includes('sunny')) return <Sun size={16} className="text-yellow-500" />;
    if (condition.includes('cloudy')) return <Cloud size={16} className="text-gray-500" />;
    if (condition.includes('rainy') || condition.includes('stormy')) 
      return <Umbrella size={16} className="text-blue-500" />;
    
    return null;
  };

  const weatherIcon = getWeatherIcon();

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "group flex items-center justify-between rounded-md border p-3 mb-2 bg-white shadow-sm hover:shadow-md transition-all duration-300",
          priorityStyles[task.priority],
          task.completed && "opacity-70"
        )}
        onClick={handleTaskClick}
      >
        <div className="flex items-center gap-3 flex-1">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => dispatch(toggleTaskCompletion(task.id))}
            className={cn(
              "transition-colors",
              task.completed ? "bg-todo-green border-todo-green" : "border-gray-300"
            )}
          />
          
          <div className="flex flex-col">
            <span className={cn(
              "text-sm font-medium text-gray-800",
              task.completed && "line-through"
            )}>
              {task.title}
            </span>
            
            <div className="flex gap-2 mt-1 items-center">
              {task.dueDate && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} />
                  {format(new Date(task.dueDate), 'MMM d')}
                </span>
              )}
              
              {weatherIcon && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  {weatherIcon}
                  {task.weather?.temperature}°
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleTogglePriority}
          >
            <Star
              size={16}
              className={cn(
                "transition-colors",
                task.priority === 'high' ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
              )}
            />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-red-500"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </motion.div>

      {!onSelect && (
        <TaskDetail 
          task={task} 
          isOpen={isDetailOpen} 
          onClose={() => setIsDetailOpen(false)} 
        />
      )}
    </>
  );
};

const TaskGrid: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface TaskListProps {
  filter?: string;
  onTaskSelect?: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ filter, onTaskSelect }) => {
  const { tasks, viewMode, searchQuery } = useAppSelector(state => state.tasks);
  
  let filteredTasks = [...tasks];
  
  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase().trim();
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(query) || 
      (task.notes && task.notes.toLowerCase().includes(query))
    );
  }
  
  if (filter === 'today') {
    filteredTasks = filteredTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      return (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      );
    });
  } else if (filter === 'important') {
    filteredTasks = filteredTasks.filter(task => task.priority === 'high');
  } else if (filter === 'planned') {
    filteredTasks = filteredTasks.filter(task => task.dueDate !== undefined);
  }
  
  filteredTasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    
    const priorityValue = { high: 0, medium: 1, low: 2 };
    return priorityValue[a.priority] - priorityValue[b.priority];
  });
  
  const incompleteTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  return (
    <div className="space-y-6">
      {viewMode === 'list' ? (
        <>
          <div>
            <h2 className="text-xl font-medium mb-4 dark:text-white">Tasks</h2>
            {incompleteTasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">No tasks found.</p>
            ) : (
              <AnimatePresence>
                {incompleteTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    filter={filter} 
                    onSelect={onTaskSelect}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
          
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-xl font-medium mb-4 dark:text-white">Completed</h2>
              <AnimatePresence>
                {completedTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    filter={filter}
                    onSelect={onTaskSelect}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      ) : (
        <>
          <div>
            <h2 className="text-xl font-medium mb-4 dark:text-white">Tasks</h2>
            {incompleteTasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">No tasks found.</p>
            ) : (
              <TaskGrid tasks={incompleteTasks} />
            )}
          </div>
          
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-xl font-medium mb-4 dark:text-white">Completed</h2>
              <TaskGrid tasks={completedTasks} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;
