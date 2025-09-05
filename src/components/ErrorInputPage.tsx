import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Zap, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import ThemeToggle from './ThemeToggle';

const ErrorInputPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [errorMessage, setErrorMessage] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const commonErrors = [
    'TypeError: Cannot read property',
    'ReferenceError: is not defined',
    'SyntaxError: Unexpected token',
    'TypeError: Cannot set property',
    'Error: Module not found',
    'TypeError: Object is not a function',
    'ReferenceError: require is not defined',
    'SyntaxError: Unexpected end of JSON input'
  ];

  const handleErrorChange = useCallback((value: string) => {
    setErrorMessage(value);
    
    if (value.length > 2) {
      const filtered = commonErrors.filter(error =>
        error.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      setScreenshot(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    }
  }, [handleFileUpload]);

  const removeScreenshot = useCallback(() => {
    setScreenshot(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!errorMessage.trim() && !screenshot) return;

    dispatch({ type: 'SET_ANALYZING', payload: true });
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        id: Date.now().toString(),
        timestamp: new Date(),
        errorMessage,
        screenshot: previewUrl,
        explanation: `This error typically occurs when trying to access a property of an undefined or null object. The JavaScript engine cannot find the specified property on the object reference.`,
        suggestedFix: `// Check if the object exists before accessing its properties
if (myObject && myObject.property) {
  console.log(myObject.property);
}

// Or use optional chaining (ES2020+)
console.log(myObject?.property);

// Alternative: provide a default value
const value = myObject?.property || 'default value';`,
        reasoning: `The error occurs because the code attempts to read a property from an object that is either undefined or null. This commonly happens when:
        
1. An API call hasn't completed yet
2. A variable wasn't initialized properly  
3. An object property doesn't exist
4. Asynchronous operations haven't finished

The suggested fixes prevent this by checking the object's existence before property access.`,
        confidence: 92,
        language: 'javascript'
      };

      dispatch({ type: 'SET_ANALYSIS', payload: mockAnalysis });
      dispatch({ type: 'ADD_TO_HISTORY', payload: mockAnalysis });
      dispatch({ type: 'SET_ANALYZING', payload: false });
      dispatch({ type: 'SET_PAGE', payload: 'results' });
    }, 2000);
  }, [errorMessage, screenshot, previewUrl, dispatch]);

  return (
    <div className={`min-h-screen pt-16 ${
      state.theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-indigo-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center mb-6">
            <h1 className={`text-4xl font-bold ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              What's Bugging You?
            </h1>
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>
          <p className={`text-xl ${
            state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Paste your error message or upload a screenshot for AI-powered analysis
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-8 ${
            state.theme === 'dark'
              ? 'bg-gray-800/50 border border-gray-700'
              : 'bg-white/50 border border-gray-200'
          } backdrop-blur-sm shadow-xl`}
        >
          {/* Error Message Input */}
          <div className="mb-8">
            <label className={`block text-sm font-medium mb-3 ${
              state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <FileText className="inline w-4 h-4 mr-2" />
              Error Message
            </label>
            <div className="relative">
              <textarea
                value={errorMessage}
                onChange={(e) => handleErrorChange(e.target.value)}
                placeholder="Paste your error message here..."
                rows={6}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
                  state.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              
              {/* Auto-suggestions */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute z-10 w-full mt-1 rounded-lg border shadow-lg max-h-40 overflow-y-auto ${
                      state.theme === 'dark'
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setErrorMessage(suggestion);
                          setShowSuggestions(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-opacity-50 transition-colors ${
                          state.theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-8">
            <label className={`block text-sm font-medium mb-3 ${
              state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <ImageIcon className="inline w-4 h-4 mr-2" />
              Screenshot (Optional)
            </label>
            
            {!screenshot ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : state.theme === 'dark'
                      ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  isDragOver ? 'text-indigo-500' : state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`font-medium mb-2 ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Drag & drop your screenshot here
                </p>
                <p className={`text-sm ${
                  state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  or click to browse files
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative rounded-xl overflow-hidden border ${
                  state.theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                }`}
              >
                <img
                  src={previewUrl}
                  alt="Error screenshot"
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={removeScreenshot}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </div>

          {/* Analyze Button */}
          <motion.button
            onClick={handleAnalyze}
            disabled={(!errorMessage.trim() && !screenshot) || state.isAnalyzing}
            className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
              (!errorMessage.trim() && !screenshot) || state.isAnalyzing
                ? state.theme === 'dark'
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl transform hover:-translate-y-1'
            }`}
            whileHover={
              (!errorMessage.trim() && !screenshot) || state.isAnalyzing 
                ? {} 
                : { scale: 1.02 }
            }
            whileTap={
              (!errorMessage.trim() && !screenshot) || state.isAnalyzing 
                ? {} 
                : { scale: 0.98 }
            }
          >
            {state.isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Bug...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Analyze Bug</span>
              </>
            )}
          </motion.button>

          {(!errorMessage.trim() && !screenshot) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center mt-3 text-sm flex items-center justify-center space-x-1 ${
                state.theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Please provide an error message or screenshot to continue</span>
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorInputPage;