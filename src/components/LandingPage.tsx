import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Zap, Shield, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import BugMascot from './BugMascot';

const LandingPage: React.FC = () => {
  const { state, dispatch } = useApp();

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Analysis',
      description: 'Get instant explanations and fixes for any error message.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your code snippets are processed securely and never stored.'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Debug faster with comprehensive reasoning and suggestions.'
    }
  ];

  return (
    <div className={`min-h-screen pt-16 ${
      state.theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-indigo-50'
    }`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Debug{' '}
                <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                  Smarter
                </span>
                ,<br />
                Not Harder
              </h1>
              
              <p className={`text-xl mb-8 leading-relaxed ${
                state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Transform cryptic error messages into clear explanations with AI-powered 
                debugging assistance. Paste your error, upload a screenshot, and get 
                instant solutions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={() => dispatch({ type: 'SET_PAGE', payload: 'input' })}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Start Debugging</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  className={`px-8 py-4 rounded-xl font-semibold text-lg border-2 ${
                    state.theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                  } transition-all duration-300`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>

            {/* 3D Bug Mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex justify-center"
            >
              <BugMascot />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className={`w-8 h-8 ${
            state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Why Choose BugBuddy?
            </h2>
            <p className={`text-xl ${
              state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Powerful features designed to make debugging effortless
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`p-8 rounded-2xl ${
                    state.theme === 'dark'
                      ? 'bg-gray-800/50 border border-gray-700'
                      : 'bg-white/50 border border-gray-200'
                  } backdrop-blur-sm hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl mb-6 mx-auto">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-4 text-center ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-center ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${
        state.theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-100/30'
      }`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={`text-4xl font-bold mb-6 ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Ready to Debug Like a Pro?
            </h2>
            <p className={`text-xl mb-8 ${
              state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join thousands of developers who've made debugging effortless with BugBuddy
            </p>
            <motion.button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: 'input' })}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;