/**
 * Cart Management System - Time Update Dialog
 * @author AJ McCrory
 * @created 2024
 * @description Dialog for updating cart return times
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
  Typography,
} from '@mui/material';
import { Cart } from '../types/types';
import { api } from '../utils/api';
import { RequestError } from '../utils/errorHandling';
import { AccessTime, EventAvailable } from '@mui/icons-material';

const StyledPaper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
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
  const [returnTime, setReturnTime] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (open && cart) {
      // Use existing return time if available, otherwise calculate new one
      if (cart.return_by_time) {
        setReturnTime(cart.return_by_time.slice(0, 16));
      }
    }
  }, [open, cart]);

  const validateTimes = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!returnTime) {
      newErrors.return_by_time = 'Return time is required';
      isValid = false;
    } else {
      const returnDate = new Date(returnTime);
      const checkoutDate = new Date(cart?.checkout_time || '');

      // Return time must be on the same day as checkout
      if (returnDate.toDateString() !== checkoutDate.toDateString()) {
        newErrors.return_by_time = 'Return time must be on the same day as checkout';
        isValid = false;
      }

      // Return time must be after checkout time
      if (returnDate <= checkoutDate) {
        newErrors.return_by_time = 'Return time must be after checkout time';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
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

      await api.updateCart(cart.id, {
        ...cart,
        return_by_time: returnTime,
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Return Time</DialogTitle>
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
                {cart?.checkout_time ? new Date(cart.checkout_time).toLocaleString() : 'Not set'}
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
                helperText={errors.return_by_time || 'Must be on the same day as checkout'}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </TimeField>
        </StyledPaper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update Return Time
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimeUpdateDialog; 