import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useReducer } from 'react';

const SettingsContext = createContext(null);

// Enhanced default settings with better organization
const defaultSettings = {
  // Audio settings
  soundEnabled: true,
  keyboardSounds: false,
  soundVolume: 50,
  
  // Display settings
  fontSize: 'medium',
  theme: 'light',
  colorScheme: 'default',
  showTimer: true,
  showProgress: true,
  showWPM: true,
  showAccuracy: true,
  
  // Typing experience
  highlightErrors: true,
  smoothCursor: true,
  autoStart: false,
  blindMode: false,
  strictMode: false,
  
  // Practice settings
  language: 'english',
  practiceMode: 'words',
  wordCount: 50,
  timeLimit: 60,
  difficulty: 'medium',
  
  // Advanced settings
  customWordList: '',
  enablePunctuation: false,
  enableNumbers: false,
  cursorStyle: 'block',
  lineHeight: 'normal',
};

// Comprehensive validation schema
const validationSchema = {
  // Audio settings
  soundEnabled: { type: 'boolean' },
  keyboardSounds: { type: 'boolean' },
  soundVolume: { type: 'number', min: 0, max: 100 },
  
  // Display settings
  fontSize: { type: 'string', enum: ['small', 'medium', 'large', 'x-large'] },
  theme: { type: 'string', enum: ['light', 'dark', 'auto'] },
  colorScheme: { type: 'string', enum: ['default', 'blue', 'green', 'purple', 'orange'] },
  showTimer: { type: 'boolean' },
  showProgress: { type: 'boolean' },
  showWPM: { type: 'boolean' },
  showAccuracy: { type: 'boolean' },
  
  // Typing experience
  highlightErrors: { type: 'boolean' },
  smoothCursor: { type: 'boolean' },
  autoStart: { type: 'boolean' },
  blindMode: { type: 'boolean' },
  strictMode: { type: 'boolean' },
  
  // Practice settings
  language: { type: 'string', enum: ['english', 'spanish', 'french', 'german', 'italian', 'portuguese'] },
  practiceMode: { type: 'string', enum: ['words', 'time', 'quote', 'custom'] },
  wordCount: { type: 'number', min: 10, max: 500 },
  timeLimit: { type: 'number', min: 15, max: 600 },
  difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
  
  // Advanced settings
  customWordList: { type: 'string', maxLength: 10000 },
  enablePunctuation: { type: 'boolean' },
  enableNumbers: { type: 'boolean' },
  cursorStyle: { type: 'string', enum: ['block', 'underline', 'line'] },
  lineHeight: { type: 'string', enum: ['compact', 'normal', 'relaxed'] },
};

// Settings reducer for better state management
const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      return { ...state, ...action.payload };
    case 'RESET_SETTINGS':
      return { ...defaultSettings };
    case 'BULK_UPDATE':
      return { ...state, ...action.payload };
    case 'TOGGLE_SETTING':
      return { ...state, [action.key]: !state[action.key] };
    default:
      return state;
  }
};

// Enhanced validation function with detailed error reporting
const validateSettings = (settings) => {
  const validatedSettings = {};
  const errors = [];
  const warnings = [];

  Object.entries(settings).forEach(([key, value]) => {
    const schema = validationSchema[key];
    
    if (!schema) {
      warnings.push(`Unknown setting: ${key}`);
      return;
    }

    // Type validation
    if (typeof value !== schema.type) {
      errors.push(`Invalid type for ${key}: expected ${schema.type}, got ${typeof value}`);
      return;
    }

    // Enum validation
    if (schema.enum && !schema.enum.includes(value)) {
      errors.push(`Invalid value for ${key}: ${value}. Allowed: ${schema.enum.join(', ')}`);
      return;
    }

    // Number range validation
    if (schema.type === 'number') {
      if (schema.min !== undefined && value < schema.min) {
        errors.push(`Value for ${key} is too low: ${value} (minimum: ${schema.min})`);
        return;
      }
      if (schema.max !== undefined && value > schema.max) {
        errors.push(`Value for ${key} is too high: ${value} (maximum: ${schema.max})`);
        return;
      }
    }

    // String length validation
    if (schema.type === 'string' && schema.maxLength && value.length > schema.maxLength) {
      errors.push(`Value for ${key} is too long: ${value.length} characters (maximum: ${schema.maxLength})`);
      return;
    }

    validatedSettings[key] = value;
  });

  return { validatedSettings, errors, warnings };
};

// Custom hook for persistent storage with error handling
const usePersistentStorage = (key, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

export const SettingsProvider = ({ children }) => {
  const [settings, dispatch] = useReducer(settingsReducer, defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = localStorage.getItem('typingSettings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          const validation = validateSettings(parsedSettings);
          
          if (validation.errors.length > 0) {
            console.error('Settings validation errors:', validation.errors);
            setErrors(validation.errors);
            // Use default settings if validation fails
            dispatch({ type: 'RESET_SETTINGS' });
          } else {
            if (validation.warnings.length > 0) {
              console.warn('Settings validation warnings:', validation.warnings);
            }
            dispatch({ 
              type: 'BULK_UPDATE', 
              payload: validation.validatedSettings 
            });
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setErrors(['Failed to load settings from storage']);
        dispatch({ type: 'RESET_SETTINGS' });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('typingSettings', JSON.stringify(settings));
        setLastSaved(new Date().toISOString());
        setErrors([]); // Clear errors on successful save
      } catch (error) {
        console.error('Error saving settings:', error);
        setErrors(['Failed to save settings to storage']);
      }
    }
  }, [settings, isLoading]);

  // Optimized update function with validation
  const updateSettings = useCallback((newSettings) => {
    const validation = validateSettings(newSettings);
    
    if (validation.errors.length > 0) {
      console.error('Settings update failed:', validation.errors);
      setErrors(validation.errors);
      return false;
    }

    if (validation.warnings.length > 0) {
      console.warn('Settings update warnings:', validation.warnings);
    }

    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: validation.validatedSettings 
    });
    setErrors([]);
    return true;
  }, []);

  // Bulk update function for importing settings
  const bulkUpdateSettings = useCallback((newSettings) => {
    const validation = validateSettings(newSettings);
    
    if (validation.errors.length > 0) {
      console.error('Bulk settings update failed:', validation.errors);
      setErrors(validation.errors);
      return false;
    }

    dispatch({ 
      type: 'BULK_UPDATE', 
      payload: validation.validatedSettings 
    });
    setErrors([]);
    return true;
  }, []);

  // Toggle a boolean setting
  const toggleSetting = useCallback((key) => {
    if (validationSchema[key]?.type === 'boolean') {
      dispatch({ type: 'TOGGLE_SETTING', key });
    } else {
      console.error(`Cannot toggle non-boolean setting: ${key}`);
    }
  }, []);

  // Reset settings to defaults
  const resetSettings = useCallback(() => {
    dispatch({ type: 'RESET_SETTINGS' });
    try {
      localStorage.removeItem('typingSettings');
      setErrors([]);
      setLastSaved(null);
    } catch (error) {
      console.error('Error clearing settings from storage:', error);
    }
  }, []);

  // Export settings for backup
  const exportSettings = useCallback(() => {
    try {
      const exportData = {
        settings,
        exportDate: new Date().toISOString(),
        version: '2.0'
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting settings:', error);
      return null;
    }
  }, [settings]);

  // Import settings from backup
  const importSettings = useCallback((importData) => {
    try {
      const parsedData = typeof importData === 'string' ? JSON.parse(importData) : importData;
      
      if (!parsedData.settings) {
        setErrors(['Invalid import data format']);
        return false;
      }

      return bulkUpdateSettings(parsedData.settings);
    } catch (error) {
      console.error('Error importing settings:', error);
      setErrors(['Failed to import settings']);
      return false;
    }
  }, [bulkUpdateSettings]);

  // Get setting by key with fallback
  const getSetting = useCallback((key, fallback = null) => {
    return settings[key] !== undefined ? settings[key] : (defaultSettings[key] || fallback);
  }, [settings]);

  // Check if settings have been modified from defaults
  const hasModifications = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(defaultSettings);
  }, [settings]);

  // Get settings diff from defaults
  const getSettingsDiff = useMemo(() => {
    const diff = {};
    Object.keys(settings).forEach(key => {
      if (settings[key] !== defaultSettings[key]) {
        diff[key] = {
          current: settings[key],
          default: defaultSettings[key]
        };
      }
    });
    return diff;
  }, [settings]);

  const contextValue = useMemo(() => ({
    // Core state
    settings,
    isLoading,
    errors,
    lastSaved,
    hasModifications,
    
    // Settings management
    updateSettings,
    bulkUpdateSettings,
    toggleSetting,
    resetSettings,
    getSetting,
    
    // Import/Export
    exportSettings,
    importSettings,
    
    // Utilities
    getSettingsDiff,
    validationSchema,
    defaultSettings,
  }), [
    settings,
    isLoading,
    errors,
    lastSaved,
    hasModifications,
    updateSettings,
    bulkUpdateSettings,
    toggleSetting,
    resetSettings,
    getSetting,
    exportSettings,
    importSettings,
    getSettingsDiff,
  ]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Custom hook for specific setting with live updates
export const useSetting = (key, fallback = null) => {
  const { getSetting, updateSettings } = useSettings();
  
  const value = getSetting(key, fallback);
  
  const setValue = useCallback((newValue) => {
    return updateSettings({ [key]: newValue });
  }, [key, updateSettings]);
  
  return [value, setValue];
};

// Custom hook for multiple settings
export const useSettingsGroup = (keys) => {
  const { settings, updateSettings } = useSettings();
  
  const values = useMemo(() => {
    const result = {};
    keys.forEach(key => {
      result[key] = settings[key];
    });
    return result;
  }, [settings, keys]);
  
  const setValues = useCallback((newValues) => {
    return updateSettings(newValues);
  }, [updateSettings]);
  
  return [values, setValues];
};

// Custom hook for practice settings
export const usePracticeSettings = () => {
  const { settings, updateSettings, getPracticeConfig } = useSettings();
  
  const practiceSettings = useMemo(() => ({
    smartPracticeMode: settings.smartPracticeMode,
    mistakeTolerance: settings.mistakeTolerance,
    autoPauseWhenIdle: settings.autoPauseWhenIdle,
    idleTimeout: settings.idleTimeout,
    focusWeakWords: settings.focusWeakWords,
    adaptiveDifficulty: settings.adaptiveDifficulty,
    minimumAccuracy: settings.minimumAccuracy,
    retryIncorrectWords: settings.retryIncorrectWords,
    showMistakeAnalysis: settings.showMistakeAnalysis,
    practiceWeakLetters: settings.practiceWeakLetters,
  }), [settings]);
  
  const updatePracticeSettings = useCallback((newPracticeSettings) => {
    return updateSettings(newPracticeSettings);
  }, [updateSettings]);
  
  return {
    practiceSettings,
    updatePracticeSettings,
    practiceConfig: getPracticeConfig
  };
};

// Custom hook for notification settings
export const useNotificationSettings = () => {
  const { 
    settings, 
    updateSettings, 
    scheduleNotification, 
    getNotificationPreferences 
  } = useSettings();
  
  const notificationSettings = useMemo(() => ({
    dailyStreakReminders: settings.dailyStreakReminders,
    emailNotifications: settings.emailNotifications,
    pushNotifications: settings.pushNotifications,
    progressUpdateFrequency: settings.progressUpdateFrequency,
    reminderTime: settings.reminderTime,
    weekendReminders: settings.weekendReminders,
    streakGoalReminders: settings.streakGoalReminders,
    achievementNotifications: settings.achievementNotifications,
    practiceReminders: settings.practiceReminders,
    reminderDays: settings.reminderDays,
  }), [settings]);
  
  const updateNotificationSettings = useCallback((newNotificationSettings) => {
    return updateSettings(newNotificationSettings);
  }, [updateSettings]);
  
  const preferences = getNotificationPreferences();
  
  return {
    notificationSettings,
    updateNotificationSettings,
    scheduleNotification,
    preferences,
    isEnabled: preferences.enabled
  };
};

// Custom hook for privacy settings
export const usePrivacySettings = () => {
  const { 
    settings, 
    updatePrivacySettings, 
    exportProgress, 
    factoryReset 
  } = useSettings();
  
  const privacySettings = useMemo(() => ({
    showLeaderboardParticipation: settings.showLeaderboardParticipation,
    shareProgressPublicly: settings.shareProgressPublicly,
    anonymousMode: settings.anonymousMode,
    dataRetention: settings.dataRetention,
    allowAnalytics: settings.allowAnalytics,
    showDetailedStats: settings.showDetailedStats,
    includeInGlobalStats: settings.includeInGlobalStats,
    autoBackup: settings.autoBackup,
    backupFrequency: settings.backupFrequency,
    exportFormat: settings.exportFormat,
  }), [settings]);
  
  return {
    privacySettings,
    updatePrivacySettings,
    exportProgress,
    factoryReset,
    isAnonymous: settings.anonymousMode,
    allowsAnalytics: settings.allowAnalytics
  };
};

export default SettingsContext;