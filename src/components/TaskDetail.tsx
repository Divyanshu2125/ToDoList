
import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/store';
import { updateTask, setTaskPriority, setTaskDueDate, setTaskNotes, addTaskStep, toggleTaskStep } from '../store/slices/tasksSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Calendar as CalendarIcon, Plus, Star, Cloud, Sun, Umbrella, X, Trash2, Check } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { Task } from '../types';
import { cn } from '../lib/utils';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { toast } from '../hooks/use-toast';

interface TaskDetailProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );
  const [newStep, setNewStep] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleUpdateTask = () => {
    if (!title.trim()) {
      toast({
        title: "Task title required",
        description: "Please enter a task title",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      updateTask({
        ...task,
        title: title.trim(),
      })
    );
    
    onClose();
  };

  const handlePriorityChange = (priority: 'high' | 'medium' | 'low') => {
    dispatch(setTaskPriority({ id: task.id, priority }));
  };

  const handleDueDateChange = (date: Date | undefined) => {
    setDueDate(date);
    if (date) {
      dispatch(setTaskDueDate({ taskId: task.id, dueDate: date.toISOString() }));
    }
    setDatePickerOpen(false);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    dispatch(setTaskNotes({ taskId: task.id, notes: e.target.value }));
  };

  const handleAddStep = () => {
    if (!newStep.trim()) return;
    
    dispatch(
      addTaskStep({
        taskId: task.id,
        step: {
          id: Date.now().toString(),
          title: newStep.trim(),
          completed: false,
        },
      })
    );
    
    setNewStep('');
  };

  const handleToggleStep = (stepId: string) => {
    dispatch(toggleTaskStep({ taskId: task.id, stepId }));
  };

  const getWeatherInfo = () => {
    if (!task.weather) return null;
    
    const { condition, temperature } = task.weather;
    
    let icon = <Cloud className="h-5 w-5 text-gray-400" />;
    if (condition?.includes('sunny')) icon = <Sun className="h-5 w-5 text-yellow-500" />;
    if (condition?.includes('rainy') || condition?.includes('stormy')) 
      icon = <Umbrella className="h-5 w-5 text-blue-500" />;
    
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
        {icon}
        <span>
          {condition}, {temperature}°C
        </span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left">Task Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
          />
          
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={task.priority === 'low' ? "default" : "outline"}
              size="sm"
              className={cn(
                "text-sm",
                task.priority === 'low' && "bg-todo-green hover:bg-todo-green/90"
              )}
              onClick={() => handlePriorityChange('low')}
            >
              Low
            </Button>
            
            <Button
              type="button"
              variant={task.priority === 'medium' ? "default" : "outline"}
              size="sm"
              className={cn(
                "text-sm",
                task.priority === 'medium' && "bg-yellow-500 hover:bg-yellow-500/90"
              )}
              onClick={() => handlePriorityChange('medium')}
            >
              Medium
            </Button>
            
            <Button
              type="button"
              variant={task.priority === 'high' ? "default" : "outline"}
              size="sm"
              className={cn(
                "text-sm",
                task.priority === 'high' && "bg-red-500 hover:bg-red-500/90"
              )}
              onClick={() => handlePriorityChange('high')}
            >
              <Star className={cn("h-4 w-4 mr-1", task.priority === 'high' && "fill-white")} />
              High
            </Button>
          </div>
          
          <div>
            <Label className="text-sm text-gray-600">Due Date</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {dueDate ? format(dueDate, 'PPP') : "Set due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={handleDueDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {getWeatherInfo()}
          
          <div>
            <Label className="text-sm text-gray-600">Steps</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                placeholder="Add a step"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddStep}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 mt-2">
              {task.steps?.map((step) => (
                <div key={step.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={step.completed}
                    onCheckedChange={() => handleToggleStep(step.id)}
                  />
                  <span className={cn(
                    "flex-1 text-sm",
                    step.completed && "line-through text-gray-400"
                  )}>
                    {step.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                    onClick={() => {/* Delete step functionality */}}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-sm text-gray-600">Notes</Label>
            <Textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add notes"
              className="min-h-24"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateTask}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetail;
