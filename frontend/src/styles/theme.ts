/**
 * Cart Management System - Theme Configuration
 * @author AJ McCrory
 * @created 2024
 * @description Material-UI theme configurations
 */

import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';

// Extend the Theme and ThemeOptions interfaces
declare module '@mui/material/styles' {
  interface Palette {
    cartStatus: {
      available: string;
      inUse: string;
      maintenance: string;
    };
  }
  interface PaletteOptions {
    cartStatus?: {
      available: string;
      inUse: string;
      maintenance: string;
    };
  }
}

// Base theme options that are shared between light and dark modes
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
};

// Light theme
export const lightTheme = createTheme({
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
    cartStatus: {
      available: '#4caf50',
      inUse: '#2196f3',
      maintenance: '#f44336',
    },
  },
});

// Dark theme
export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#ef5350',
      light: '#ff867c',
      dark: '#b61827',
    },
    secondary: {
      main: '#f44336',
      light: '#ff7961',
      dark: '#ba000d',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    cartStatus: {
      available: '#81c784',
      inUse: '#64b5f6',
      maintenance: '#e57373',
    },
  },
});

// Helper function to get status color
export const getStatusColor = (status: string, theme: Theme): string => {
  switch (status) {
    case 'available':
      return theme.palette.cartStatus.available;
    case 'in-use':
      return theme.palette.cartStatus.inUse;
    case 'maintenance':
      return theme.palette.cartStatus.maintenance;
    default:
      return theme.palette.grey[500];
  }
}; 