/**
 * Cart Management System - Theme Configuration
 * @author AJ McCrory
 * @created 2024
 * @description Material-UI theme configurations for red and black themes
 */

import { createTheme } from '@mui/material/styles';

/**
 * Red theme configuration
 */
export const redTheme = createTheme({
  palette: {
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
  },
});

/**
 * Black theme configuration
 */
export const blackTheme = createTheme({
  palette: {
    primary: {
      main: '#212121',
      light: '#484848',
      dark: '#000000',
    },
    secondary: {
      main: '#424242',
      light: '#6d6d6d',
      dark: '#1b1b1b',
    },
  },
}); 