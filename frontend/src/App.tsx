/**
 * Cart Management System - Main Application Component
 * @author AJ McCrory
 * @created 2024
 * @description Root component that handles theme switching and layout
 */

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { redTheme, blackTheme } from './styles/theme';
import AdminScreen from './pages/AdminScreen';
import { Button } from '@mui/material';
import ErrorSnackbar from './components/ErrorSnackbar';

const App: React.FC = () => {
  const [theme, setTheme] = useState(redTheme);
  const [error, setError] = useState<string | null>(null);

  const toggleTheme = () => {
    setTheme(theme === redTheme ? blackTheme : redTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Button
        onClick={toggleTheme}
        variant="contained"
        style={{ position: 'absolute', top: 20, right: 20 }}
      >
        Toggle Theme
      </Button>
      <AdminScreen onError={(msg) => setError(msg)} />
      <ErrorSnackbar
        open={!!error}
        message={error || ''}
        onClose={() => setError(null)}
      />
    </ThemeProvider>
  );
};

export default App; 