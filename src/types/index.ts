export interface ErrorAnalysis {
  id: string;
  timestamp: Date;
  errorMessage: string;
  screenshot?: string;
  explanation: string;
  suggestedFix: string;
  reasoning: string;
  confidence: number;
  language?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  apiKey?: string;
  theme: 'light' | 'dark';
  primaryColor: string;
}

export interface AppState {
  currentPage: 'landing' | 'input' | 'results' | 'history' | 'profile';
  theme: 'light' | 'dark';
  isAnalyzing: boolean;
  currentAnalysis?: ErrorAnalysis;
  analysisHistory: ErrorAnalysis[];
  user: User;
}