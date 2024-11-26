/**
 * Cart Management System - Layout Component
 * @author AJ McCrory
 * @created 2024
 * @description Main layout component with theme support and error handling
 */

import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  ThemeProvider,
  CssBaseline,
  IconButton,
  Snackbar,
  Alert,
  styled,
  useTheme,
} from '@mui/material';
import { 
  Brightness4, 
  Brightness7, 
  DirectionsCar as CarIcon 
} from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(45deg, #1a237e 30%, #283593 90%)'
    : 'linear-gradient(45deg, #d32f2f 30%, #c62828 90%)',
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.standard,
  }),
}));

interface LayoutProps {
  children: React.ReactNode;
  error?: string | null;
  onErrorClear: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  error,
  onErrorClear,
  isDarkMode,
  onThemeToggle,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <StyledAppBar position="sticky" elevation={0}>
        <Toolbar>
          <LogoContainer sx={{ flexGrow: 1 }}>
            <CarIcon sx={{ fontSize: 32 }} />
            <Typography variant="h5" component="div">
              Cart Management System
            </Typography>
          </LogoContainer>
          
          <IconButton 
            color="inherit" 
            onClick={onThemeToggle}
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </StyledAppBar>

      <MainContent>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      </MainContent>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={onErrorClear}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={onErrorClear} 
          severity="error" 
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: theme.shadows[3],
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Layout; 