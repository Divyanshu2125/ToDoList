
import React from 'react';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import { motion } from 'framer-motion';

const Planned: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold dark:text-white">Planned Tasks</h1>
      <TaskInput />
      <TaskList filter="planned" />
    </motion.div>
  );
};

export default Planned;
