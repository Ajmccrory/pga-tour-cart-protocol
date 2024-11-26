import { useState } from 'react';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from '../components/Layout';
import { redTheme, blackTheme } from '../styles/theme';
import ErrorSnackbar from '../components/ErrorSnackbar'

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(redTheme);
  const [error, setError] = useState<string | null>(null);

  const handleThemeToggle = () => {
    setTheme(current => current === redTheme ? blackTheme : redTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout 
        error={error}
        onErrorClear={() => setError(null)}
        isDarkMode={theme === blackTheme}
        onThemeToggle={handleThemeToggle}
      >
        <Component {...pageProps} />
      </Layout>
      <ErrorSnackbar
        open={!!error}
        message={error || ''}
        onClose={() => setError(null)}
      />
    </ThemeProvider>
  );
}
