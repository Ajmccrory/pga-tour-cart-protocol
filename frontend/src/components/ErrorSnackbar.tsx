/**
 * Cart Management System - Person List Component
 * @author AJ McCrory
 * @created 2024
 * @description Displays and manages staff members list with CRUD operations
 */
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface ErrorSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({ open, message, onClose }) => {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={6000} 
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={onClose} 
        severity="error" 
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar; 