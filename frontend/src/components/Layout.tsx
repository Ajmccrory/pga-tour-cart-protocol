/**
 * Cart Management System - Layout Component
 * @author AJ McCrory
 * @created 2024
 * @description Main layout component with error handling and theme support
 */

import React from 'react';
import {
  Box,
  Button,
} from '@mui/material';


interface LayoutProps {
  children: React.ReactNode;
  error: string | null;
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
  return (
    <Box sx={{ p: 3 }}>
      <Button
        onClick={onThemeToggle}
        variant="contained"
        sx={{ position: 'absolute', top: 20, right: 20 }}
      >
        Toggle Theme
      </Button>
      {children}
    </Box>
  );
};

export default Layout; 