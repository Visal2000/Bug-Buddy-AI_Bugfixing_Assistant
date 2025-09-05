import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './contexts/AppContext';
import Navigation from './components/Navigation';
import ParticleBackground from './components/ParticleBackground';
import LandingPage from './components/LandingPage';
import ErrorInputPage from './components/ErrorInputPage';
import ResultsPage from './components/ResultsPage';
import HistoryPage from './components/HistoryPage';
import ProfilePage from './components/ProfilePage';

const AppContent: React.FC = () => {
  const { state } = useApp();

  const pageComponents = {
    landing: LandingPage,
    input: ErrorInputPage,
    results: ResultsPage,
    history: HistoryPage,
    profile: ProfilePage,
  };

  const CurrentPage = pageComponents[state.currentPage];

  const pageVariants = {
    initial: { 
      opacity: 0, 
      x: 300,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: -300,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className={`${state.theme} transition-colors duration-300`}>
      <div className={`min-h-screen ${
        state.theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        <ParticleBackground />
        <Navigation />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10"
          >
            <CurrentPage />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;