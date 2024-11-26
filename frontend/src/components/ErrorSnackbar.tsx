/**
 * Cart Management System - Error Snackbar Component
 * @author AJ McCrory
 * @created 2024
 * @description Displays error messages in a styled snackbar
 */

import React from 'react';
import { 
  Snackbar, 
  Alert, 
  styled,
  useTheme,
} from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[6],
  '& .MuiAlert-icon': {
    fontSize: 28,
  },
  '& .MuiAlert-message': {
    fontSize: 16,
    fontWeight: 500,
  },
  minWidth: 300,
  maxWidth: '80vw',
}));

interface ErrorSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({
  open,
  message,
  onClose,
  duration = 6000,
}) => {
  const theme = useTheme();

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      sx={{
        mb: 2,
      }}
    >
      <StyledAlert
        onClose={onClose}
        severity="error"
        variant="filled"
        icon={<ErrorIcon fontSize="inherit" />}
        sx={{
          backgroundColor: theme.palette.error.dark,
          '& .MuiAlert-icon': {
            color: theme.palette.error.contrastText,
          },
        }}
      >
        {message}
      </StyledAlert>
    </Snackbar>
  );
};

export default ErrorSnackbar; 