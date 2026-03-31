import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Save, RotateCcw, Volume2, VolumeX, 
  Type, Clock, Target, Palette, Globe, User, Shield, Bell,
  Monitor, Smartphone, Tablet, Eye, EyeOff, Zap
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

const Settings = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { theme, toggleTheme, typingTheme, setTypingTheme } = useTheme();
  const { resetStats } = useUser();
  const [activeTab, setActiveTab] = useState('general');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Define allowed tabs to prevent object injection
  const allowedTabs = {
    general: 'General',
    typing: 'Typing',
    appearance: 'Appearance',
    sound: 'Sound',
    privacy: 'Privacy'
  };

  // Define allowed settings keys to prevent object injection
  const allowedSettings = {
    soundEnabled: 'boolean',
    keyboardSounds: 'boolean',
    fontSize: 'string',
    language: 'string',
    showTimer: 'boolean',
    showProgress: 'boolean',
    highlightErrors: 'boolean',
    smoothCursor: 'boolean',
    autoStart: 'boolean',
    practiceMode: 'string',
    wordCount: 'number',
    timeLimit: 'number'
  };

  // Define allowed typing themes to prevent object injection
  const allowedThemes = {
    default: 'Default',
    cyberpunk: 'Cyberpunk',
    retro: 'Retro',
    calming: 'Calming',
    kids: 'Kids'
  };

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'typing', name: 'Typing', icon: Type },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'sound', name: 'Sound', icon: Volume2 },
    { id: 'privacy', name: 'Privacy', icon: Shield },
  ];

  // Safe tab switching with validation
  const handleTabChange = (tabId) => {
    if (allowedTabs[tabId]) {
      setActiveTab(tabId);
    }
  };

  // Safe settings update with validation
  const handleSettingChange = (key, value) => {
    // Validate the setting key exists in allowed settings
    if (!allowedSettings[key]) {
      console.warn(`Invalid setting key: ${key}`);
      return;
    }

    // Validate the value type matches expected type
    const expectedType = allowedSettings[key];
    const actualType = typeof value;
    
    if (expectedType === 'number' && actualType !== 'number') {
      console.warn(`Invalid type for ${key}: expected ${expectedType}, got ${actualType}`);
      return;
    }
    
    if (expectedType === 'boolean' && actualType !== 'boolean') {
      console.warn(`Invalid type for ${key}: expected ${expectedType}, got ${actualType}`);
      return;
    }
    
    if (expectedType === 'string' && actualType !== 'string') {
      console.warn(`Invalid type for ${key}: expected ${expectedType}, got ${actualType}`);
      return;
    }

    // Additional validation for specific settings
    if (key === 'fontSize') {
      const allowedSizes = ['small', 'medium', 'large'];
      if (!allowedSizes.includes(value)) {
        console.warn(`Invalid fontSize value: ${value}`);
        return;
      }
    }

    if (key === 'language') {
      const allowedLanguages = ['english', 'spanish', 'french', 'german'];
      if (!allowedLanguages.includes(value)) {
        console.warn(`Invalid language value: ${value}`);
        return;
      }
    }

    if (key === 'practiceMode') {
      const allowedModes = ['words', 'time', 'quote'];
      if (!allowedModes.includes(value)) {
        console.warn(`Invalid practiceMode value: ${value}`);
        return;
      }
    }

    if (key === 'wordCount') {
      if (value < 10 || value > 500) {
        console.warn(`Invalid wordCount value: ${value}`);
        return;
      }
    }

    if (key === 'timeLimit') {
      if (value < 15 || value > 600) {
        console.warn(`Invalid timeLimit value: ${value}`);
        return;
      }
    }

    // Safe update using validated key-value pairs
    const validatedUpdate = {};
    switch (key) {
      case 'soundEnabled':
        validatedUpdate.soundEnabled = value;
        break;
      case 'keyboardSounds':
        validatedUpdate.keyboardSounds = value;
        break;
      case 'fontSize':
        validatedUpdate.fontSize = value;
        break;
      case 'language':
        validatedUpdate.language = value;
        break;
      case 'showTimer':
        validatedUpdate.showTimer = value;
        break;
      case 'showProgress':
        validatedUpdate.showProgress = value;
        break;
      case 'highlightErrors':
        validatedUpdate.highlightErrors = value;
        break;
      case 'smoothCursor':
        validatedUpdate.smoothCursor = value;
        break;
      case 'autoStart':
        validatedUpdate.autoStart = value;
        break;
      case 'practiceMode':
        validatedUpdate.practiceMode = value;
        break;
      case 'wordCount':
        validatedUpdate.wordCount = value;
        break;
      case 'timeLimit':
        validatedUpdate.timeLimit = value;
        break;
      default:
        console.warn(`Unhandled setting key: ${key}`);
        return;
    }
    updateSettings(validatedUpdate);
  };

  // Safe theme change with validation
  const handleThemeChange = (themeId) => {
    if (allowedThemes[themeId]) {
      setTypingTheme(themeId);
    }
  };

  const handleResetSettings = () => {
    resetSettings();
    setShowResetConfirm(false);
  };

  const handleResetStats = () => {
    resetStats();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Settings &</span>
            <br />
            <span className="text-gray-800 dark:text-white">Preferences</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Customize your typing experience to match your preferences and goals.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  General Settings
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Español</option>
                        <option value="french">Français</option>
                        <option value="german">Deutsch</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Practice Mode
                      </label>
                      <select
                        value={settings.practiceMode}
                        onChange={(e) => handleSettingChange('practiceMode', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="words">Word Count</option>
                        <option value="time">Time Limit</option>
                        <option value="quote">Quote Mode</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Auto-start lessons
                      </label>
                      <button
                        onClick={() => handleSettingChange('autoStart', !settings.autoStart)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.autoStart ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.autoStart ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Show timer
                      </label>
                      <button
                        onClick={() => handleSettingChange('showTimer', !settings.showTimer)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.showTimer ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.showTimer ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Show progress bar
                      </label>
                      <button
                        onClick={() => handleSettingChange('showProgress', !settings.showProgress)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.showProgress ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.showProgress ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Typing Settings */}
            {activeTab === 'typing' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Typing Settings
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Font Size
                      </label>
                      <select
                        value={settings.fontSize}
                        onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Word Count ({settings.wordCount})
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={settings.wordCount}
                        onChange={(e) => handleSettingChange('wordCount', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Time Limit ({settings.timeLimit}s)
                      </label>
                      <input
                        type="range"
                        min="15"
                        max="600"
                        step="15"
                        value={settings.timeLimit}
                        onChange={(e) => handleSettingChange('timeLimit', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Highlight errors
                      </label>
                      <button
                        onClick={() => handleSettingChange('highlightErrors', !settings.highlightErrors)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.highlightErrors ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.highlightErrors ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Smooth cursor
                      </label>
                      <button
                        onClick={() => handleSettingChange('smoothCursor', !settings.smoothCursor)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.smoothCursor ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.smoothCursor ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sound Settings */}
            {activeTab === 'sound' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Sound Settings
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {settings.soundEnabled ? (
                        <Volume2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-red-500" />
                      )}
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable sounds
                      </label>
                    </div>
                    <button
                      onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Keyboard sounds
                    </label>
                    <button
                      onClick={() => handleSettingChange('keyboardSounds', !settings.keyboardSounds)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.keyboardSounds ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.keyboardSounds ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Privacy & Data
                </h2>

                <div className="space-y-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                          Data Storage
                        </h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          All your typing data is stored locally in your browser. No personal information is sent to external servers.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>Reset All Data</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Settings are automatically saved
              </div>
              <button
                onClick={resetSettings}
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to defaults</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Reset All Data?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This will permanently delete all your typing statistics, achievements, and settings. This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetStats}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reset All Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;