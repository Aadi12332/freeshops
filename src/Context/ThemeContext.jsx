import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Context create karein
export const ThemeContext = createContext();

// 2. Custom hook for easier usage
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 3. Provider component (Corrected Version)
export const ThemeProvider = ({ children }) => {
  // ✅ Seedha localStorage se theme lo, ya default 'light' set karo
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem('theme');
    // Check for valid theme values, default to 'light' if invalid
    return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const body = document.body;

    // Purani classes remove karo
    body.classList.remove('dark-mode', 'light-mode');

    // Nayi theme class add karo
    if (theme === 'dark') {
      body.classList.add('dark-mode');
    } else {
      body.classList.add('light-mode');
    }

    // ✅ Nayi theme ko seedha localStorage mein save karo
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error("Could not save theme to localStorage:", error);
    }
  }, [theme]);

  // Theme toggle function
  const toggleTheme = (newTheme) => {
    if (newTheme && (newTheme === 'light' || newTheme === 'dark')) {
      setTheme(newTheme);
    } else {
      setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    }
  };
  
  // Logout ke liye reset function
  const resetTheme = () => {
    setTheme('light'); // default par reset
  };

  const value = {
    theme,
    toggleTheme,
    resetTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// 4. Example usage component (Your original button code is fine)
export const ThemeToggleButton = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={() => toggleTheme()}
      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
        isDark
          ? 'bg-gray-700 text-white hover:bg-gray-600'
          : 'bg-gray-200 text-black hover:bg-gray-300'
      }`}
    >
      {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
};