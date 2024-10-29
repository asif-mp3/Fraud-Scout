// context/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import './ThemeContext.css';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme = 'light' }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    if (mounted) {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(theme);
      document.body.classList.add('theme-transition');
      localStorage.setItem('theme', theme);

      const timeout = setTimeout(() => {
        document.body.classList.remove('theme-transition');
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [theme, mounted]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Custom hook for accessing theme-based styles
export const useThemeStyles = () => {
  const { theme } = useTheme();
  return {
    backgroundColor: theme === 'light' ? 'var(--background-light)' : 'var(--background-dark)',
    color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
    // Add more theme-based styles as needed
  };
};

// HOC to wrap components that need theme context
export const withTheme = <P extends object>(
  Component: React.ComponentType<P & ThemeContextType>
) => {
  return (props: P) => {
    const themeProps = useTheme();
    return <Component {...props} {...themeProps} />;
  };
};