
import React from 'react';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import { motion } from 'framer-motion';

const Important: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold dark:text-white">Important Tasks</h1>
      <TaskInput />
      <TaskList filter="important" />
    </motion.div>
  );
};

export default Important;
