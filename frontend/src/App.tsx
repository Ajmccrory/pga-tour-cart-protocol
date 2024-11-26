/**
 * Cart Management System - Root Application Component
 * @author AJ McCrory
 * @created 2024
 * @description Root component that handles theme switching and layout
 */

import React, { useState } from 'react';
import { redTheme, blackTheme } from './styles/theme';
import AdminScreen from './pages/AdminScreen';
import Layout from './components/Layout';
import ErrorSnackbar from './components/ErrorSnackbar';

const App: React.FC = () => {
  const [theme, setTheme] = useState(redTheme);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === redTheme ? blackTheme : redTheme);
    setIsDarkMode(!isDarkMode);
  };

  const handleErrorClear = () => {
    setError(null);
  };

  return (
    <Layout
      error={error}
      onErrorClear={handleErrorClear}
      isDarkMode={isDarkMode}
      onThemeToggle={toggleTheme}
    >
      <AdminScreen onError={(msg: string) => setError(msg)} />
      <ErrorSnackbar
        open={!!error}
        message={error || ''}
        onClose={handleErrorClear}
      />
    </Layout>
  );
};

export default App; 