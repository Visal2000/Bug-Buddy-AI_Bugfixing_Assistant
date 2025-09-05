import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, ErrorAnalysis } from '../types';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

type AppAction =
  | { type: 'SET_PAGE'; payload: AppState['currentPage'] }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_ANALYZING'; payload: boolean }
  | { type: 'SET_ANALYSIS'; payload: ErrorAnalysis }
  | { type: 'ADD_TO_HISTORY'; payload: ErrorAnalysis }
  | { type: 'UPDATE_USER'; payload: Partial<AppState['user']> };

const initialState: AppState = {
  currentPage: 'landing',
  theme: 'dark',
  isAnalyzing: false,
  analysisHistory: [],
  user: {
    id: '1',
    name: 'Developer',
    email: 'dev@example.com',
    theme: 'dark',
    primaryColor: '#4F46E5'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      return { 
        ...state, 
        theme: newTheme,
        user: { ...state.user, theme: newTheme }
      };
    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload };
    case 'SET_ANALYSIS':
      return { ...state, currentAnalysis: action.payload };
    case 'ADD_TO_HISTORY':
      return { 
        ...state, 
        analysisHistory: [action.payload, ...state.analysisHistory] 
      };
    case 'UPDATE_USER':
      return { 
        ...state, 
        user: { ...state.user, ...action.payload } 
      };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};