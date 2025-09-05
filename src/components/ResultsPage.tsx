import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Copy, 
  BookOpen, 
  Wrench, 
  Brain,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ResultsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'explanation' | 'fix' | 'reasoning'>('explanation');
  const [copied, setCopied] = useState(false);

  if (!state.currentAnalysis) {
    return (
      <div className={`min-h-screen pt-16 flex items-center justify-center ${
        state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <p className={`text-xl ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            No analysis available
          </p>
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'input' })}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go back to input
          </button>
        </div>
      </div>
    );
  }

  const { currentAnalysis } = state;

  const tabs = [
    { id: 'explanation' as const, label: 'Explanation', icon: BookOpen },
    { id: 'fix' as const, label: 'Suggested Fix', icon: Wrench },
    { id: 'reasoning' as const, label: 'Reasoning', icon: Brain }
  ];

  const handleCopyFix = async () => {
    try {
      await navigator.clipboard.writeText(currentAnalysis.suggestedFix);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'from-green-500 to-emerald-500';
    if (confidence >= 60) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-rose-500';
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
          <div className="flex items-center mb-4">
            <button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: 'input' })}
              className={`p-2 rounded-lg mr-4 transition-colors ${
                state.theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className={`text-3xl font-bold ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Bug Analysis Results
            </h1>
          </div>
          
          {/* Confidence Meter */}
          <div className={`p-4 rounded-xl ${
            state.theme === 'dark' 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-white/50 border border-gray-200'
          } backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${
                state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                AI Confidence Level
              </span>
              <span className={`text-sm font-bold ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {currentAnalysis.confidence}%
              </span>
            </div>
            <div className={`w-full h-2 rounded-full ${
              state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentAnalysis.confidence}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-2 rounded-full bg-gradient-to-r ${getConfidenceColor(currentAnalysis.confidence)}`}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Error Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className={`rounded-2xl p-6 ${
              state.theme === 'dark'
                ? 'bg-gray-800/50 border border-gray-700'
                : 'bg-white/50 border border-gray-200'
            } backdrop-blur-sm shadow-xl`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Original Error
              </h3>
              
              <div className={`p-4 rounded-lg mb-4 ${
                state.theme === 'dark' ? 'bg-gray-900/50' : 'bg-red-50'
              }`}>
                <code className={`text-sm ${
                  state.theme === 'dark' ? 'text-red-300' : 'text-red-700'
                }`}>
                  {currentAnalysis.errorMessage}
                </code>
              </div>

              {currentAnalysis.screenshot && (
                <div className="mb-4">
                  <h4 className={`text-sm font-medium mb-2 ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Screenshot
                  </h4>
                  <img
                    src={currentAnalysis.screenshot}
                    alt="Error screenshot"
                    className="w-full rounded-lg border"
                  />
                </div>
              )}

              <div className="text-xs text-gray-500">
                Analyzed: {currentAnalysis.timestamp.toLocaleString()}
              </div>
            </div>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className={`rounded-2xl ${
              state.theme === 'dark'
                ? 'bg-gray-800/50 border border-gray-700'
                : 'bg-white/50 border border-gray-200'
            } backdrop-blur-sm shadow-xl overflow-hidden`}>
              {/* Tab Navigation */}
              <div className={`flex border-b ${
                state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all ${
                        activeTab === tab.id
                          ? state.theme === 'dark'
                            ? 'bg-gray-700 text-white border-b-2 border-indigo-500'
                            : 'bg-gray-50 text-indigo-600 border-b-2 border-indigo-500'
                          : state.theme === 'dark'
                            ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'explanation' && (
                      <div>
                        <h3 className={`text-xl font-semibold mb-4 flex items-center ${
                          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          <BookOpen className="w-5 h-5 mr-2" />
                          What's Happening?
                        </h3>
                        <p className={`text-base leading-relaxed ${
                          state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {currentAnalysis.explanation}
                        </p>
                      </div>
                    )}

                    {activeTab === 'fix' && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className={`text-xl font-semibold flex items-center ${
                            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            <Wrench className="w-5 h-5 mr-2" />
                            Suggested Fix
                          </h3>
                          <motion.button
                            onClick={handleCopyFix}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                              copied
                                ? 'bg-green-600 text-white'
                                : state.theme === 'dark'
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {copied ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                <span>Copy Fix</span>
                              </>
                            )}
                          </motion.button>
                        </div>
                        
                        <div className="rounded-lg overflow-hidden">
                          <SyntaxHighlighter
                            language={currentAnalysis.language || 'javascript'}
                            style={state.theme === 'dark' ? vscDarkPlus : vs}
                            className="text-sm"
                          >
                            {currentAnalysis.suggestedFix}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    )}

                    {activeTab === 'reasoning' && (
                      <div>
                        <h3 className={`text-xl font-semibold mb-4 flex items-center ${
                          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          <Brain className="w-5 h-5 mr-2" />
                          Why This Solution Works
                        </h3>
                        <div className={`text-base leading-relaxed whitespace-pre-line ${
                          state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {currentAnalysis.reasoning}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center space-x-4 mt-8"
        >
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'input' })}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            Analyze Another Bug
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'history' })}
            className={`px-6 py-3 rounded-lg font-medium border-2 transition-all duration-300 ${
              state.theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
                : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
            }`}
          >
            View History
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage;