import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  BarChart3, 
  History, 
  User, 
  Bug 
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Navigation: React.FC = () => {
  const { state, dispatch } = useApp();

  const navItems = [
    { id: 'landing' as const, icon: Home, label: 'Home' },
    { id: 'input' as const, icon: Search, label: 'Analyze' },
    { id: 'results' as const, icon: BarChart3, label: 'Results' },
    { id: 'history' as const, icon: History, label: 'History' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${
      state.theme === 'dark' 
        ? 'bg-gray-900/80 border-gray-700' 
        : 'bg-white/80 border-gray-200'
    } backdrop-blur-md border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Bug className="w-8 h-8 text-indigo-500" />
            <span className={`font-bold text-xl ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              BugBuddy
            </span>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = state.currentPage === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => dispatch({ type: 'SET_PAGE', payload: item.id })}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? state.theme === 'dark'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-100 text-indigo-700'
                      : state.theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;