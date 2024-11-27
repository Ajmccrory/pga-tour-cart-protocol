/**
 * Cart Management System - Cart Form Component
 * @author AJ McCrory
 * @created 2024
 * @description Form for creating and editing carts with validation
 */

import React, { useState } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Box,
  styled,
  Paper,
} from '@mui/material';
import { Cart } from '../types/types';
import { api } from '../utils/api';
import { CartStatus, CART_STATUS_LABELS } from '../types/cartStatus';
import { RequestError } from '../utils/errorHandling';
import BatteryGauge from './BatteryGauge';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  minWidth: '500px',
  padding: theme.spacing(3),
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

interface CartFormProps {
  cart?: Cart;
  onSubmit: () => void;
  onClose: () => void;
  onError: (message: string) => void;
}

interface ValidationErrors {
  cart_number?: string;
  battery_level?: string;
  checkout_time?: string;
  return_by_time?: string;
  general?: string;
}

const CartForm: React.FC<CartFormProps> = ({
  cart,
  onSubmit,
  onClose,
  onError,
}) => {
  const [formData, setFormData] = useState<Partial<Cart>>(() => {
    if (cart) {
      return cart;
    }
    
    return {
      cart_number: '',
      status: 'available' as CartStatus,
      battery_level: 100,
      checkout_time: null,
      return_by_time: null,
    };
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const setCartTimes = () => {
    const now = new Date();
    const sixHoursLater = new Date(now.getTime() + (6 * 60 * 60 * 1000));
    return {
      checkout_time: now.toISOString(),
      return_by_time: sixHoursLater.toISOString()
    };
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Cart number validation
    if (!formData.cart_number?.trim()) {
      newErrors.cart_number = 'Cart number is required';
      isValid = false;
    } else if (!/^[A-Za-z0-9-]+$/.test(formData.cart_number)) {
      newErrors.cart_number = 'Cart number can only contain letters, numbers, and hyphens';
      isValid = false;
    }

    // Battery level validation
    if (formData.battery_level === undefined || formData.battery_level === null) {
      newErrors.battery_level = 'Battery level is required';
      isValid = false;
    } else if (formData.battery_level < 0 || formData.battery_level > 100) {
      newErrors.battery_level = 'Battery level must be between 0 and 100';
      isValid = false;
    }

    // Time validation for 'in-use' status
    if (formData.status === 'in-use') {
      const now = new Date();
      const checkout = new Date(formData.checkout_time || now);
      
      if (!formData.return_by_time) {
        newErrors.return_by_time = 'Return time is required for in-use carts';
        isValid = false;
      } else {
        const returnBy = new Date(formData.return_by_time);
        const minReturnTime = new Date(checkout.getTime() + 30 * 60000); // 30 minutes after checkout
        const maxReturnTime = new Date(checkout.getTime() + 24 * 60 * 60000); // 24 hours after checkout

        if (returnBy <= checkout) {
          newErrors.return_by_time = 'Return time must be after checkout time';
          isValid = false;
        } else if (returnBy < minReturnTime) {
          newErrors.return_by_time = 'Return time must be at least 30 minutes after checkout';
          isValid = false;
        } else if (returnBy > maxReturnTime) {
          newErrors.return_by_time = 'Return time cannot be more than 24 hours after checkout';
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleStatusChange = (newStatus: CartStatus) => {
    const times = newStatus === 'in-use' ? setCartTimes() : { checkout_time: null, return_by_time: null };
    
    setFormData({
      ...formData,
      status: newStatus,
      ...times
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      const submissionData = { ...formData };
      
      // If status is in-use, set times right before submission
      if (submissionData.status === 'in-use') {
        const times = setCartTimes();
        submissionData.checkout_time = times.checkout_time;
        submissionData.return_by_time = times.return_by_time;
      }

      if (cart) {
        await api.updateCart(cart.id, submissionData);
      } else {
        await api.createCart(submissionData);
      }
      onSubmit();
      onClose();
    } catch (error) {
      if (error instanceof RequestError) {
        // Handle specific error cases
        if (error.message.includes('already exists')) {
          setErrors({ cart_number: error.message });
        } else if (error.message.includes('Battery level')) {
          setErrors({ battery_level: error.message });
        } else if (error.message.includes('status')) {
          setErrors({ general: error.message });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle sx={{ pb: 0 }}>
        {cart ? 'Edit Cart' : 'New Cart'}
      </DialogTitle>
      <StyledDialogContent>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.general}
          </Alert>
        )}

        <StyledPaper>
          <FormSection>
            <TextField
              fullWidth
              label="Cart Number"
              value={formData.cart_number}
              onChange={(e) => setFormData({ ...formData, cart_number: e.target.value })}
              required
              error={!!errors.cart_number}
              helperText={errors.cart_number || 'Use letters, numbers, and hyphens only'}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleStatusChange(e.target.value as CartStatus)}
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  },
                }}
              >
                {Object.entries(CART_STATUS_LABELS).map(([value, label]) => (
                  <MenuItem 
                    key={value} 
                    value={value}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: value === 'available' ? '#4caf50' : 
                                value === 'in-use' ? '#2196f3' : '#f44336',
                      }}
                    />
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Battery Level"
                value={formData.battery_level}
                onChange={(e) => setFormData({
                  ...formData,
                  battery_level: parseInt(e.target.value)
                })}
                required
                error={!!errors.battery_level}
                helperText={errors.battery_level || 'Enter a value between 0 and 100'}
                inputProps={{ min: 0, max: 100 }}
              />
              <Box sx={{ mt: 1 }}>
                <BatteryGauge level={formData.battery_level || 0} />
              </Box>
            </Box>
          </FormSection>

          {formData.status === 'in-use' && (
            <FormSection>
              <TextField
                fullWidth
                type="datetime-local"
                label="Checkout Time"
                value={formData.checkout_time || ''}
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                type="datetime-local"
                label="Return By"
                value={formData.return_by_time || ''}
                disabled
                InputLabelProps={{ shrink: true }}
                helperText="Return time is automatically set to 6 hours after checkout"
              />
            </FormSection>
          )}
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
          type="submit" 
          variant="contained" 
          color="primary"
          sx={{ borderRadius: 2 }}
        >
          {cart ? 'Update Cart' : 'Create Cart'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default CartForm; 