
import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/store';
import { format } from 'date-fns';
import { 
  Bell, Calendar, RotateCcw, Plus, Trash2, X, 
  Star, Check, Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Task } from '../types';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  toggleTaskCompletion, 
  setTaskPriority, 
  addTaskStep, 
  toggleTaskStep, 
  deleteTask,
  setTaskNotes 
} from '../store/slices/tasksSlice';
import { toast } from '../hooks/use-toast';

interface TaskDetailPanelProps {
  task: Task;
  onClose: () => void;
}

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({ task, onClose }) => {
  const dispatch = useAppDispatch();
  const [newStep, setNewStep] = useState('');
  const [notes, setNotes] = useState(task.notes || '');

  const handleToggleCompletion = () => {
    dispatch(toggleTaskCompletion(task.id));
    toast({
      title: task.completed ? "Task marked as incomplete" : "Task completed",
      description: task.title,
    });
  };

  const handleTogglePriority = () => {
    const newPriority = task.priority === 'high' ? 'low' : 'high';
    dispatch(setTaskPriority({ id: task.id, priority: newPriority }));
    toast({
      title: `Task priority set to ${newPriority}`,
      description: task.title,
    });
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStep.trim()) return;
    
    dispatch(addTaskStep({
      taskId: task.id,
      step: {
        id: Date.now().toString(),
        title: newStep.trim(),
        completed: false
      }
    }));
    
    setNewStep('');
  };

  const handleToggleStep = (stepId: string) => {
    dispatch(toggleTaskStep({ taskId: task.id, stepId }));
  };

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    toast({
      title: "Task deleted",
      description: task.title,
      variant: "destructive",
    });
    onClose();
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    dispatch(setTaskNotes({ taskId: task.id, notes: e.target.value }));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-white">Task Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X size={18} />
        </Button>
      </div>
      
      <div className="flex items-start gap-3 mb-4">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggleCompletion}
          className={cn(
            "mt-1 transition-colors",
            task.completed ? "bg-todo-green border-todo-green" : "border-gray-300"
          )}
        />
        
        <div className="flex-1">
          <h3 className={cn(
            "text-base font-medium dark:text-white",
            task.completed && "line-through text-gray-500"
          )}>
            {task.title}
          </h3>
          
          {task.dueDate && (
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Clock size={12} className="mr-1" />
              <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleTogglePriority}
        >
          <Star
            size={18}
            className={cn(
              "transition-colors",
              task.priority === 'high' ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
            )}
          />
        </Button>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-todo-darker"
        >
          <Bell size={16} className="mr-2" />
          <span>Set Reminder</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-todo-darker"
        >
          <Calendar size={16} className="mr-2" />
          <span>Add Due Date</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-todo-darker"
        >
          <RotateCcw size={16} className="mr-2" />
          <span>Repeat</span>
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <h3 className="text-sm font-medium dark:text-white">Steps</h3>
        </div>
        
        <form onSubmit={handleAddStep} className="mb-2">
          <div className="flex items-center gap-2">
            <Plus size={16} className="text-gray-400" />
            <Input
              type="text"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              placeholder="Add a step"
              className="h-8 text-sm"
            />
          </div>
        </form>
        
        {task.steps && task.steps.length > 0 && (
          <ul className="space-y-2 mt-3">
            {task.steps.map(step => (
              <li key={step.id} className="flex items-start gap-2">
                <Checkbox
                  checked={step.completed}
                  onCheckedChange={() => handleToggleStep(step.id)}
                  className={cn(
                    "mt-1 h-4 w-4 transition-colors",
                    step.completed ? "bg-todo-green border-todo-green" : "border-gray-300"
                  )}
                />
                <span className={cn(
                  "text-sm dark:text-gray-300",
                  step.completed && "line-through text-gray-500"
                )}>
                  {step.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 dark:text-white">Notes</h3>
        <Textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add notes here..."
          className="min-h-24 text-sm resize-none dark:bg-todo-darker dark:text-gray-300"
        />
      </div>
      
      <div className="mt-auto border-t dark:border-todo-darkBorder pt-4">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPanel;
