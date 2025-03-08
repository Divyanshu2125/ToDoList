
import React, { useMemo } from 'react';
import { useAppSelector } from '../hooks/store';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '../lib/utils';

const TaskStats: React.FC = () => {
  const { tasks } = useAppSelector(state => state.tasks);
  
  const stats = useMemo(() => {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.filter(task => !task.completed).length;
    const total = tasks.length;
    
    return {
      completed,
      pending,
      total,
      completedPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      pendingPercentage: total > 0 ? Math.round((pending / total) * 100) : 0
    };
  }, [tasks]);
  
  const data = [
    { name: 'Pending', value: stats.pending, color: '#000000' },
    { name: 'Completed', value: stats.completed, color: '#4CAF50' }
  ];
  
  // If no tasks, show empty state
  if (stats.total === 0) {
    return (
      <div className="mt-4 text-center p-4">
        <div className="text-sm font-medium dark:text-gray-300">No tasks yet</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">Add tasks to see statistics</div>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium dark:text-gray-300">Today Tasks</div>
        <div className="bg-gray-800 text-white dark:bg-todo-darker text-xs px-2 py-1 rounded-full">
          {stats.total}
        </div>
      </div>
      
      <div className="h-[120px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={44}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className={cn(
                    index === 0 && "fill-gray-800 dark:fill-gray-900",
                    index === 1 && "fill-todo-green"
                  )}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-around mt-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-800 dark:bg-gray-900 rounded-full"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Pending</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-todo-green rounded-full"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Done</span>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
