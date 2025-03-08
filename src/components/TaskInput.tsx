import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/store';
import { addTask } from '../store/slices/tasksSlice';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Bell, Calendar, RotateCcw } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { motion } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { cn } from '../lib/utils';

const TaskInput: React.FC = () => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDueDate, setShowDueDate] = useState(false);
  const [repeatOption, setRepeatOption] = useState<string | undefined>(undefined);
  const [showRepeat, setShowRepeat] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState<string>('30mins');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Task title required",
        description: "Please enter a task title",
        variant: "destructive",
      });
      return;
    }

    const taskDueDate = dueDate || new Date(); // If no due date selected, use today's date

    dispatch(
      addTask({
        title: title.trim(),
        completed: false,
        priority: 'medium',
        dueDate: taskDueDate.toISOString(),
      })
    );

    toast({
      title: "Task added",
      description: `${title.trim()} (Due: ${format(taskDueDate, 'MM/dd/yyyy')})`,
    });

    // Reset form
    setTitle('');
    setDueDate(undefined);
    setShowDueDate(false);
    setRepeatOption(undefined);
    setShowRepeat(false);
    setShowReminder(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-50 dark:bg-todo-darker rounded-md p-4 mb-6"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a Task"
            className="bg-white dark:bg-todo-dark border-gray-200 dark:border-todo-darkBorder dark:text-white"
          />
          <Button 
            type="submit" 
            className="absolute right-1 top-1 bg-todo-green hover:bg-todo-green/90 text-white"
          >
            ADD TASK
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Popover open={showReminder} onOpenChange={setShowReminder}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "text-gray-500 dark:text-gray-400 hover:text-todo-green dark:hover:text-todo-green",
                  showReminder && "text-todo-green dark:text-todo-green"
                )}
              >
                <Bell size={16} className="mr-1" />
                <span className="text-xs">Reminder</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 dark:bg-todo-dark dark:border-todo-darkBorder">
              <div className="space-y-2">
                <h4 className="font-medium dark:text-white">Set Reminder</h4>
                <RadioGroup defaultValue={reminderTime} onValueChange={setReminderTime}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30mins" id="r1" />
                    <Label htmlFor="r1" className="dark:text-gray-300">30 minutes before</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1hour" id="r2" />
                    <Label htmlFor="r2" className="dark:text-gray-300">1 hour before</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1day" id="r3" />
                    <Label htmlFor="r3" className="dark:text-gray-300">1 day before</Label>
                  </div>
                </RadioGroup>
                <Button 
                  className="w-full mt-2 bg-todo-green hover:bg-todo-green/90" 
                  onClick={() => setShowReminder(false)}
                >
                  Save
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover open={showDueDate} onOpenChange={setShowDueDate}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "text-gray-500 dark:text-gray-400 hover:text-todo-green dark:hover:text-todo-green",
                  dueDate && "text-todo-green dark:text-todo-green"
                )}
              >
                <Calendar size={16} className="mr-1" />
                <span className="text-xs">
                  {dueDate ? format(dueDate, 'MM/dd/yyyy') : "Due Date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 dark:bg-todo-dark dark:border-todo-darkBorder">
              <CalendarComponent
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                className="border-none"
              />
            </PopoverContent>
          </Popover>
          
          <Popover open={showRepeat} onOpenChange={setShowRepeat}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "text-gray-500 dark:text-gray-400 hover:text-todo-green dark:hover:text-todo-green",
                  repeatOption && "text-todo-green dark:text-todo-green"
                )}
              >
                <RotateCcw size={16} className="mr-1" />
                <span className="text-xs">
                  {repeatOption || "Repeat"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 dark:bg-todo-dark dark:border-todo-darkBorder">
              <div className="space-y-2">
                <h4 className="font-medium dark:text-white">Repeat</h4>
                <RadioGroup 
                  defaultValue={repeatOption} 
                  onValueChange={(value) => {
                    setRepeatOption(value);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Daily" id="r-daily" />
                    <Label htmlFor="r-daily" className="dark:text-gray-300">Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Weekly" id="r-weekly" />
                    <Label htmlFor="r-weekly" className="dark:text-gray-300">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Monthly" id="r-monthly" />
                    <Label htmlFor="r-monthly" className="dark:text-gray-300">Monthly</Label>
                  </div>
                </RadioGroup>
                <Button 
                  className="w-full mt-2 bg-todo-green hover:bg-todo-green/90" 
                  onClick={() => setShowRepeat(false)}
                >
                  Save
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskInput;
