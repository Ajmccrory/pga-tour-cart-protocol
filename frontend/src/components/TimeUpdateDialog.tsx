/**
 * Cart Management System - Time Update Dialog Component
 * @author AJ McCrory
 * @created 2024
 * @description Dialog for updating cart checkout and return times
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
  styled,
  Paper,
  Typography,
} from '@mui/material';
import { Cart } from '../types/types';
import { api } from '../utils/api';
import { RequestError } from '../utils/errorHandling';
import { AccessTime, EventAvailable } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  minWidth: '500px',
  padding: theme.spacing(3),
}));

const TimeField = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

interface TimeUpdateDialogProps {
  open: boolean;
  cart: Cart | null;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  onError: (message: string) => void;
}

interface ValidationErrors {
  return_by_time?: string;
  general?: string;
}

const TimeUpdateDialog: React.FC<TimeUpdateDialogProps> = ({
  open,
  cart,
  onClose,
  onSubmit,
  onError,
}) => {
  const [returnTime, setReturnTime] = useState<string>(() => {
    const now = new Date();
    const sixHoursLater = new Date(now.getTime() + (6 * 60 * 60 * 1000));
    return sixHoursLater.toISOString().slice(0, 16);
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (open) {
      const now = new Date();
      const sixHoursLater = new Date(now.getTime() + (6 * 60 * 60 * 1000));
      setReturnTime(sixHoursLater.toISOString().slice(0, 16));
      setErrors({}); // Clear any previous errors
    }
  }, [open]);

  const validateTimes = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    const now = new Date();
    const returnBy = new Date(returnTime);
    const minReturnTime = new Date(now.getTime() + 30 * 60000); // 30 minutes after now
    const maxReturnTime = new Date(now.getTime() + 24 * 60 * 60000); // 24 hours after now

    if (!returnTime) {
      newErrors.return_by_time = 'Return time is required';
      isValid = false;
    } else if (returnBy <= now) {
      newErrors.return_by_time = 'Return time must be after current time';
      isValid = false;
    } else if (returnBy < minReturnTime) {
      newErrors.return_by_time = 'Return time must be at least 30 minutes from now';
      isValid = false;
    } else if (returnBy > maxReturnTime) {
      newErrors.return_by_time = 'Return time cannot be more than 24 hours from now';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const formatLocalDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getCurrentTimeString = () => {
    const now = new Date();
    return now.toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSubmit = async () => {
    setErrors({});

    if (!validateTimes()) {
      return;
    }

    try {
      if (!cart) {
        throw new Error('No cart selected');
      }

      const now = new Date();
      
      await api.updateCart(cart.id, {
        ...cart,
        status: 'in-use',
        checkout_time: now.toISOString(),
        return_by_time: new Date(returnTime).toISOString(),
      });

      await onSubmit();
      onClose();
    } catch (error) {
      if (error instanceof RequestError) {
        if (error.message.includes('return_by_time')) {
          setErrors({ return_by_time: error.message });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: 'Failed to update cart times. Please try again.' });
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Cart Times</DialogTitle>
      <DialogContent>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}

        <StyledPaper>
          <TimeField>
            <IconWrapper>
              <AccessTime />
            </IconWrapper>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Checkout Time
              </Typography>
              <Typography variant="body1">
                {getCurrentTimeString()}
              </Typography>
            </Box>
          </TimeField>

          <TimeField>
            <IconWrapper>
              <EventAvailable />
            </IconWrapper>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Return By
              </Typography>
              <TextField
                fullWidth
                type="datetime-local"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                required
                error={!!errors.return_by_time}
                helperText={errors.return_by_time}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </TimeField>
        </StyledPaper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update Times
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimeUpdateDialog; 