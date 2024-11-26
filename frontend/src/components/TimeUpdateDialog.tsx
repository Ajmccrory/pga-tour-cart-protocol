/**
 * Cart Management System - Time Update Dialog Component
 * @author AJ McCrory
 * @created 2024
 * @description Dialog for updating cart checkout and return times
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import { Cart } from '../types/types';
import { api } from '../utils/api';

interface TimeUpdateDialogProps {
  open: boolean;
  cart: Cart | null;
  onClose: () => void;
  onSubmit: () => void;
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

  const validateTimes = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    const now = new Date();
    const checkout = new Date(checkoutTime);
    const returnBy = new Date(returnTime);

    // Checkout time validation
    if (!checkoutTime) {
      newErrors.checkout_time = 'Checkout time is required';
      isValid = false;
    } else if (checkout < now) {
      newErrors.checkout_time = 'Checkout time cannot be in the past';
      isValid = false;
    }

    // Return time validation
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
        checkout_time: checkoutTime,
        return_by_time: returnTime,
        status: 'in-use',
      });

      onSubmit();
      onClose();
    } catch (error: any) {
      setErrors({ general: error.message });
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

        <TextField
          fullWidth
          type="datetime-local"
          label="Checkout Time"
          value={checkoutTime}
          onChange={(e) => setCheckoutTime(e.target.value)}
          margin="normal"
          required
          error={!!errors.checkout_time}
          helperText={errors.checkout_time}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          type="datetime-local"
          label="Return By"
          value={returnTime}
          onChange={(e) => setReturnTime(e.target.value)}
          margin="normal"
          required
          error={!!errors.return_by_time}
          helperText={errors.return_by_time}
          InputLabelProps={{ shrink: true }}
        />
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