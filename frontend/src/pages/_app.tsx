/**
 * Cart Management System - Next.js App Component
 * @author AJ McCrory
 * @created 2024
 * @description Root Next.js application component with global providers
 */

import type { AppProps } from 'next/app';
import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from '../styles/theme';

export default function App({ Component, pageProps }: AppProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleThemeToggle = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
