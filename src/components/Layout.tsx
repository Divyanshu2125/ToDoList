
import React, { useState } from 'react';
import { useAppSelector } from '../hooks/store';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useToast } from '../hooks/use-toast';
import { useNavigate, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to access this page",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-todo-darker">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-14">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-7xl"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;
