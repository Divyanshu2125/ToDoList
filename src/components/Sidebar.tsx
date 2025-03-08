import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/store';
import { logout } from '../store/slices/authSlice';
import { Link, useLocation } from 'react-router-dom';
import { CheckSquare, Calendar, Star, LayoutGrid, ClipboardList, List, Moon, Sun, User, LogOut, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { toggleViewMode } from '../store/slices/tasksSlice';
import { motion } from 'framer-motion';
import TaskStats from './TaskStats';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}> = ({ to, icon, children, active, onClick }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-gray-100 dark:hover:bg-todo-darker relative",
        active && "bg-gray-100 dark:bg-todo-darker text-todo-green"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
      {active && (
        <motion.div
          layoutId="active-link-indicator"
          className="absolute left-0 h-6 w-1 rounded-r-md bg-todo-green"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { viewMode } = useAppSelector(state => state.tasks);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

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

  const sidebarLinks = [
    { path: '/', icon: <ClipboardList size={20} />, label: 'All Tasks' },
    { path: '/today', icon: <Calendar size={20} />, label: 'Today' },
    { path: '/important', icon: <Star size={20} />, label: 'Important' },
    { path: '/planned', icon: <LayoutGrid size={20} />, label: 'Planned' },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white dark:bg-todo-dark border-r dark:border-todo-darkBorder">
      <div className="flex items-center gap-2 px-4 py-4 border-b dark:border-todo-darkBorder">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-todo-green" />
          <span className="font-semibold text-lg dark:text-white">DoIt</span>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={toggleSidebar}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col gap-2 px-2 py-4">
        <div className="flex justify-between items-center mb-4 p-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-2 text-left flex-1">
            <p className="text-sm font-medium dark:text-gray-200">Hey, {user?.name.split(' ')[0]}</p>
          </div>
        </div>
      </div>

      <nav className="space-y-1 relative px-2 py-4">
        {sidebarLinks.map((link) => (
          <SidebarLink
            key={link.path}
            to={link.path}
            icon={link.icon}
            active={location.pathname === link.path}
            onClick={() => toggleSidebar()}
          >
            {link.label}
          </SidebarLink>
        ))}
      </nav>

      <div className="mt-4 border-t dark:border-todo-darkBorder">
        <TaskStats />
      </div>

      <div className="mt-auto p-4 border-t dark:border-todo-darkBorder">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">View Mode</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleViewMode}
              className="flex items-center gap-1 text-xs dark:text-gray-300 dark:hover:bg-todo-darker"
            >
              {viewMode === 'list' ? (
                <>
                  <List size={16} /> List
                </>
              ) : (
                <>
                  <LayoutGrid size={16} /> Card
                </>
              )}
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="flex items-center gap-1 text-xs dark:text-gray-300 dark:hover:bg-todo-darker"
            >
              {isDarkMode ? (
                <>
                  <Sun size={16} /> Light
                </>
              ) : (
                <>
                  <Moon size={16} /> Dark
                </>
              )}
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex w-full justify-start items-center gap-2 mt-2 text-xs dark:text-gray-300 dark:hover:bg-todo-darker"
              >
                <User size={16} /> My Profile
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-todo-darker">
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-xs dark:text-gray-300 dark:hover:bg-todo-dark/70">
                <LogOut size={16} /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={cn(
        "fixed left-0 top-14 bottom-0 z-20 w-64 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:top-0 md:translate-x-0 md:block md:shrink-0"
      )}>
        {sidebarContent}
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
