/**
 * Cart Management System - Root Application Component
 * @author AJ McCrory
 * @created 2024
 * @description Root component that handles theme switching and layout
 */

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './styles/theme';
import AdminScreen from './pages/AdminScreen';
import Layout from './components/Layout';
import ErrorSnackbar from './components/ErrorSnackbar';

interface AdminScreenProps {
  onError: (message: string) => void;
}

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleErrorClear = () => {
    setError(null);
  };

  const handleError = (message: string) => {
    setError(message);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Layout
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
      >
        <AdminScreen onError={handleError} />
        <ErrorSnackbar
          open={!!error}
          message={error || ''}
          onClose={handleErrorClear}
        />
      </Layout>
    </ThemeProvider>
  );
};

export default App; 