/**
 * Cart Management System - Theme Configuration
 * @author AJ McCrory
 * @created 2024
 * @description Material-UI theme configurations
 */

import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';

// Extend the Theme and ThemeOptions interfaces
declare module '@mui/material/styles' {
  interface Theme {
    cartStatus: {
      available: string;
      inUse: string;
      maintenance: string;
    };
  }
  
  interface ThemeOptions {
    cartStatus?: {
      available: string;
      inUse: string;
      maintenance: string;
    };
  }
}

// Define status colors
const statusColors = {
  available: '#4caf50',
  inUse: '#2196f3',
  maintenance: '#f44336',
};

// Base theme configuration
const baseThemeOptions: ThemeOptions = {
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
  cartStatus: {
    available: statusColors.available,
    inUse: statusColors.inUse,
    maintenance: statusColors.maintenance,
  },
};

// Light theme (red)
export const redTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    secondary: {
      main: '#f44336',
      light: '#ff7961',
      dark: '#ba000d',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

// Dark theme (black)
export const blackTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#424242',
      light: '#616161',
      dark: '#212121',
    },
    secondary: {
      main: '#757575',
      light: '#9e9e9e',
      dark: '#424242',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

// Helper function to get status color
export const getStatusColor = (status: string, theme: Theme = redTheme): string => {
  switch (status) {
    case 'available':
      return theme.cartStatus.available;
    case 'in-use':
      return theme.cartStatus.inUse;
    case 'maintenance':
      return theme.cartStatus.maintenance;
    default:
      return theme.palette.grey[500];
  }
}; 