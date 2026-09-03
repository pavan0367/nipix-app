import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Theme preference: 'light' | 'dark' | 'system'
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('nipix_theme_mode') || 'system';
  });

  // Effective active theme: 'light' | 'dark'
  const [activeTheme, setActiveTheme] = useState(() => {
    if (themeMode === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeMode;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let resolvedTheme = themeMode;
      if (themeMode === 'system') {
        resolvedTheme = mediaQuery.matches ? 'dark' : 'light';
      }
      setActiveTheme(resolvedTheme);
      
      // Apply theme to both html (documentElement) and body for 100% CSS coverage
      document.documentElement.setAttribute('data-theme', resolvedTheme);
      document.body.setAttribute('data-theme', resolvedTheme);
      document.documentElement.className = `theme-${resolvedTheme}`;
      document.body.className = `theme-${resolvedTheme}`;
    };

    applyTheme();

    const handleSystemChange = (e) => {
      if (themeMode === 'system') {
        const newTheme = e.matches ? 'dark' : 'light';
        setActiveTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        document.body.setAttribute('data-theme', newTheme);
        document.documentElement.className = `theme-${newTheme}`;
        document.body.className = `theme-${newTheme}`;
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [themeMode]);

  const changeTheme = (newMode) => {
    setThemeMode(newMode);
    localStorage.setItem('nipix_theme_mode', newMode);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, activeTheme, changeTheme }}>
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

export default ThemeContext;
