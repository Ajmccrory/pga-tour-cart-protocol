import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { redTheme, blackTheme } from './styles/theme';
import AdminScreen from './pages/AdminScreen';
import { Button } from '@mui/material';

const App: React.FC = () => {
  const [theme, setTheme] = useState(redTheme);

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
      <AdminScreen />
    </ThemeProvider>
  );
};

export default App; 