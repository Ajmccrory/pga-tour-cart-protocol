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
  checkout_time?: string;
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
  const [checkoutTime, setCheckoutTime] = useState(cart?.checkout_time || '');
  const [returnTime, setReturnTime] = useState(cart?.return_by_time || '');
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (cart) {
      setCheckoutTime(cart.checkout_time || '');
      setReturnTime(cart.return_by_time || '');
    }
  }, [cart]);

  const validateTimes = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    const now = new Date();
    const checkout = new Date(checkoutTime);
    const returnBy = new Date(returnTime);

    if (!checkoutTime) {
      newErrors.checkout_time = 'Checkout time is required';
      isValid = false;
    } else if (checkout < now) {
      newErrors.checkout_time = 'Checkout time cannot be in the past';
      isValid = false;
    }

    if (!returnTime) {
      newErrors.return_by_time = 'Return time is required';
      isValid = false;
    } else if (returnBy <= checkout) {
      newErrors.return_by_time = 'Return time must be after checkout time';
      isValid = false;
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
        status: 'in-use',
        checkout_time: checkoutTime,
        return_by_time: returnTime,
      });

      await onSubmit();
      onClose();
    } catch (error) {
      if (error instanceof RequestError) {
        if (error.message.includes('checkout_time')) {
          setErrors({ checkout_time: error.message });
        } else if (error.message.includes('return_by_time')) {
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
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle sx={{ pb: 0 }}>
        Update Times for Cart #{cart?.cart_number}
      </DialogTitle>
      <StyledDialogContent>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 3 }}>
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
              <TextField
                fullWidth
                type="datetime-local"
                value={checkoutTime}
                onChange={(e) => setCheckoutTime(e.target.value)}
                required
                error={!!errors.checkout_time}
                helperText={errors.checkout_time}
                InputLabelProps={{ shrink: true }}
              />
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
      </StyledDialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          sx={{ borderRadius: 2 }}
        >
          Update Times
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimeUpdateDialog; 