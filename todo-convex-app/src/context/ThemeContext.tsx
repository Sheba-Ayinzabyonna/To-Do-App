// src/context/ThemeContext.tsx
import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, AppTheme } from '../theme/light'; // Import types
import { Appearance } from 'react-native';

const COLOR_SCHEME_KEY = 'color-scheme';

interface ThemeContextProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentTheme: AppTheme;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  toggleTheme: () => {},
  currentTheme: lightTheme,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(systemScheme || 'light');

  useEffect(() => {
    const loadTheme = async () => {
      const persistedTheme = (await AsyncStorage.getItem(COLOR_SCHEME_KEY)) as 'light' | 'dark';
      if (persistedTheme) {
        setTheme(persistedTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem(COLOR_SCHEME_KEY, newTheme);
  };

  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const contextValue = useMemo(() => ({
    theme,
    toggleTheme,
    currentTheme,
  }), [theme, currentTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy access
export const useTheme = () => useContext(ThemeContext);