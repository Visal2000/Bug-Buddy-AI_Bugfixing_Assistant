import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Camera, 
  Key, 
  Palette, 
  Save, 
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ProfilePage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [name, setName] = useState(state.user.name);
  const [email, setEmail] = useState(state.user.email);
  const [apiKey, setApiKey] = useState(state.user.apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(state.user.primaryColor);
  const [avatarPreview, setAvatarPreview] = useState(state.user.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colorPresets = [
    '#4F46E5', // Indigo
    '#7C3AED', // Purple
    '#EC4899', // Pink
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#8B5CF6', // Violet
  ];

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_USER',
      payload: {
        name,
        email,
        apiKey,
        primaryColor,
        avatar: avatarPreview,
      }
    });
    
    // Visual feedback
    const button = document.querySelector('#save-button');
    if (button) {
      button.textContent = 'Saved!';
      setTimeout(() => {
        button.textContent = 'Save Changes';
      }, 2000);
    }
  };

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
          className="mb-8"
        >
          <h1 className={`text-4xl font-bold mb-4 ${
            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Profile & Settings
          </h1>
          <p className={`text-xl ${
            state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Customize your BugBuddy experience
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl p-6 ${
              state.theme === 'dark'
                ? 'bg-gray-800/50 border border-gray-700'
                : 'bg-white/50 border border-gray-200'
            } backdrop-blur-sm shadow-xl`}
          >
            <h3 className={`text-lg font-semibold mb-6 flex items-center ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <User className="w-5 h-5 mr-2" />
              Profile Picture
            </h3>

            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera className="w-4 h-4" />
                </motion.button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  state.theme === 'dark'
                    ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
            </div>
          </motion.div>

          {/* Main Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <div className={`rounded-2xl p-6 ${
              state.theme === 'dark'
                ? 'bg-gray-800/50 border border-gray-700'
                : 'bg-white/50 border border-gray-200'
            } backdrop-blur-sm shadow-xl`}>
              <h3 className={`text-lg font-semibold mb-6 flex items-center ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      state.theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      state.theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* API Key Management */}
            <div className={`rounded-2xl p-6 ${
              state.theme === 'dark'
                ? 'bg-gray-800/50 border border-gray-700'
                : 'bg-white/50 border border-gray-200'
            } backdrop-blur-sm shadow-xl`}>
              <h3 className={`text-lg font-semibold mb-6 flex items-center ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <Key className="w-5 h-5 mr-2" />
                API Configuration
              </h3>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  OpenAI API Key (Optional)
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className={`w-full px-4 py-2 pr-12 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      state.theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      state.theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className={`text-xs mt-1 ${
                  state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Add your own API key for enhanced features and higher limits
                </p>
              </div>
            </div>

            {/* Theme Customization */}
            <div className={`rounded-2xl p-6 ${
              state.theme === 'dark'
                ? 'bg-gray-800/50 border border-gray-700'
                : 'bg-white/50 border border-gray-200'
            } backdrop-blur-sm shadow-xl`}>
              <h3 className={`text-lg font-semibold mb-6 flex items-center ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <Palette className="w-5 h-5 mr-2" />
                Theme Customization
              </h3>

              <div>
                <label className={`block text-sm font-medium mb-4 ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Primary Color
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {colorPresets.map((color) => (
                    <motion.button
                      key={color}
                      onClick={() => setPrimaryColor(color)}
                      className={`w-12 h-12 rounded-lg border-4 transition-all ${
                        primaryColor === color 
                          ? 'border-white shadow-lg scale-110' 
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </div>
                
                <div className="mt-4">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-16 h-8 rounded border-2 border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              id="save-button"
              onClick={handleSave}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;