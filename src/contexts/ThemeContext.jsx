import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(undefined);

// Define allowed themes to prevent object injection
const allowedThemes = ['light', 'dark'];
const allowedTypingThemes = ['default', 'cyberpunk', 'retro', 'calming', 'kids'];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [typingTheme, setTypingTheme] = useState('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedTypingTheme = localStorage.getItem('typingTheme');
    
    // Validate saved theme values
    if (savedTheme && allowedThemes.includes(savedTheme)) {
      setTheme(savedTheme);
    }
    if (savedTypingTheme && allowedTypingThemes.includes(savedTypingTheme)) {
      setTypingTheme(savedTypingTheme);
    }
    
    // Check system preference
    if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('typingTheme', typingTheme);
  }, [typingTheme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTypingThemeSecure = (newTheme) => {
    if (allowedTypingThemes.includes(newTheme)) {
      setTypingTheme(newTheme);
    } else {
      console.warn(`Invalid typing theme: ${newTheme}`);
    }
  };
  return (
    <ThemeContext.Provider value={{ theme, typingTheme, toggleTheme, setTypingTheme: setTypingThemeSecure }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};