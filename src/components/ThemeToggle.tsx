import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ThemeToggle: React.FC = () => {
  const { state, dispatch } = useApp();

  return (
    <motion.button
      onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
      className={`p-2 rounded-full ${
        state.theme === 'dark'
          ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } transition-colors`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {state.theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;