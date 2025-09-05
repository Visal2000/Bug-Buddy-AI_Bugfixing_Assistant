import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Clock, 
  TrendingUp, 
  Trash2,
  Eye
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ErrorAnalysis } from '../types';

const HistoryPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'confidence'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredAndSortedHistory = useMemo(() => {
    let filtered = state.analysisHistory;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(analysis =>
        analysis.errorMessage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Confidence filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(analysis => {
        if (filterBy === 'high') return analysis.confidence >= 80;
        if (filterBy === 'medium') return analysis.confidence >= 60 && analysis.confidence < 80;
        if (filterBy === 'low') return analysis.confidence < 60;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return b.confidence - a.confidence;
    });

    return filtered;
  }, [state.analysisHistory, searchTerm, sortBy, filterBy]);

  const handleViewAnalysis = (analysis: ErrorAnalysis) => {
    dispatch({ type: 'SET_ANALYSIS', payload: analysis });
    dispatch({ type: 'SET_PAGE', payload: 'results' });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-500';
    if (confidence >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <div className={`min-h-screen pt-16 ${
      state.theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-indigo-50'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-bold mb-4 ${
            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Analysis History
          </h1>
          <p className={`text-xl ${
            state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Review and revisit your past bug analyses
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-6 mb-8 ${
            state.theme === 'dark'
              ? 'bg-gray-800/50 border border-gray-700'
              : 'bg-white/50 border border-gray-200'
          } backdrop-blur-sm shadow-xl`}
        >
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search error messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  state.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'confidence')}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  state.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="date">Sort by Date</option>
                <option value="confidence">Sort by Confidence</option>
              </select>
            </div>

            {/* Filter */}
            <div className="relative">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as 'all' | 'high' | 'medium' | 'low')}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  state.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Confidence Levels</option>
                <option value="high">High Confidence (80%+)</option>
                <option value="medium">Medium Confidence (60-79%)</option>
                <option value="low">Low Confidence (&lt;60%)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {filteredAndSortedHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-12 ${
                state.theme === 'dark'
                  ? 'bg-gray-800/50 border border-gray-700'
                  : 'bg-white/50 border border-gray-200'
              } backdrop-blur-sm rounded-2xl`}
            >
              <Clock className={`w-16 h-16 mx-auto mb-4 ${
                state.theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {searchTerm || filterBy !== 'all' ? 'No matching analyses found' : 'No analyses yet'}
              </h3>
              <p className={`${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {searchTerm || filterBy !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start analyzing bugs to see your history here'
                }
              </p>
              {!searchTerm && filterBy === 'all' && (
                <button
                  onClick={() => dispatch({ type: 'SET_PAGE', payload: 'input' })}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Start Analyzing
                </button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedHistory.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-2xl p-6 ${
                    state.theme === 'dark'
                      ? 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
                      : 'bg-white/50 border border-gray-200 hover:border-gray-300'
                  } backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
                  onClick={() => handleViewAnalysis(analysis)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`flex items-center space-x-1 text-sm ${
                          state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Clock className="w-4 h-4" />
                          <span>{analysis.timestamp.toLocaleDateString()}</span>
                        </div>
                        <div className={`flex items-center space-x-1 text-sm ${getConfidenceColor(analysis.confidence)}`}>
                          <TrendingUp className="w-4 h-4" />
                          <span>{analysis.confidence}% ({getConfidenceLabel(analysis.confidence)})</span>
                        </div>
                      </div>
                      
                      <h3 className={`font-semibold mb-2 truncate ${
                        state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {analysis.errorMessage.length > 100 
                          ? `${analysis.errorMessage.substring(0, 100)}...`
                          : analysis.errorMessage
                        }
                      </h3>
                      
                      <p className={`text-sm ${
                        state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {analysis.explanation.length > 150
                          ? `${analysis.explanation.substring(0, 150)}...`
                          : analysis.explanation
                        }
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewAnalysis(analysis);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          state.theme === 'dark'
                            ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Stats Summary */}
        {state.analysisHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`mt-8 p-6 rounded-2xl ${
              state.theme === 'dark'
                ? 'bg-gray-800/50 border border-gray-700'
                : 'bg-white/50 border border-gray-200'
            } backdrop-blur-sm`}
          >
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className={`text-2xl font-bold mb-1 ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {state.analysisHistory.length}
                </div>
                <div className={`text-sm ${
                  state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Analyses
                </div>
              </div>
              
              <div>
                <div className={`text-2xl font-bold mb-1 ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {Math.round(
                    state.analysisHistory.reduce((acc, curr) => acc + curr.confidence, 0) / 
                    state.analysisHistory.length
                  )}%
                </div>
                <div className={`text-sm ${
                  state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Average Confidence
                </div>
              </div>
              
              <div>
                <div className={`text-2xl font-bold mb-1 ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {state.analysisHistory.filter(a => a.confidence >= 80).length}
                </div>
                <div className={`text-sm ${
                  state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  High Confidence
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;