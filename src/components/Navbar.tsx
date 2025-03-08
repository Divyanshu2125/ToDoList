
import React, { useState, useEffect } from 'react';
import { Search, LayoutGrid, Sun, Moon, Menu, List } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { toggleViewMode, searchTasks } from '../store/slices/tasksSlice';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { Input } from './ui/input';
import { fetchCurrentWeather } from '../store/slices/weatherSlice';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const dispatch = useAppDispatch();
  const { viewMode } = useAppSelector(state => state.tasks);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  React.useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleToggleViewMode = () => {
    dispatch(toggleViewMode());
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(searchTasks(searchQuery));
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      dispatch(searchTasks(''));
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-10 h-14 flex items-center px-4 bg-white dark:bg-todo-dark border-b border-gray-200 dark:border-todo-darkBorder">
      <div className="flex items-center gap-2 md:gap-4 w-full">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5 dark:text-gray-300" />
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-todo-green font-bold text-xl">DoIt</span>
        </div>
        
        <div className="flex-1 flex justify-center">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="w-full max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="search-input"
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-9 pr-3 dark:bg-todo-darker dark:text-white dark:border-todo-darkBorder"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    dispatch(searchTasks(e.target.value));
                  }}
                />
              </div>
            </form>
          ) : null}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleSearch}>
            <Search className="h-5 w-5 dark:text-gray-300" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={handleToggleViewMode}
          >
            {viewMode === 'list' ? (
              <LayoutGrid className="h-5 w-5 dark:text-gray-300" />
            ) : (
              <List className="h-5 w-5 text-todo-green" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 dark:text-gray-300" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
