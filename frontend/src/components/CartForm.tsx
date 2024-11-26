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
} from '@mui/material';
import { Cart } from '../types/types';
import { api } from '../utils/api';
import { CartStatus, CART_STATUS_LABELS } from '../types/cartStatus';

interface CartFormProps {
  cart?: Cart;
  onSubmit: () => void;
  onClose: () => void;
  onError: (message: string) => void;
}

interface ValidationErrors {
  cart_number?: string;
  battery_level?: string;
  general?: string;
}

const CartForm: React.FC<CartFormProps> = ({
  cart,
  onSubmit,
  onClose,
  onError,
}) => {
  const [formData, setFormData] = useState<Partial<Cart>>(
    cart || {
      cart_number: '',
      status: 'available' as CartStatus,
      battery_level: 100,
    }
  );

  const [errors, setErrors] = useState<ValidationErrors>({});

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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      if (cart) {
        await api.updateCart(cart.id, formData);
      } else {
        await api.createCart(formData);
      }
      onSubmit();
      onClose();
    } catch (error: any) {
      if (error.message.includes('cart number already exists')) {
        setErrors({ cart_number: 'This cart number is already in use' });
      } else {
        setErrors({ general: error.message });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {cart ? 'Edit Cart' : 'New Cart'}
      </DialogTitle>
      <DialogContent>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Cart Number"
          value={formData.cart_number}
          onChange={(e) => setFormData({ ...formData, cart_number: e.target.value })}
          margin="normal"
          required
          error={!!errors.cart_number}
          helperText={errors.cart_number || 'Use letters, numbers, and hyphens only'}
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as CartStatus })}
          >
            {Object.entries(CART_STATUS_LABELS).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="number"
          label="Battery Level"
          value={formData.battery_level}
          onChange={(e) => setFormData({
            ...formData,
            battery_level: parseInt(e.target.value)
          })}
          margin="normal"
          required
          error={!!errors.battery_level}
          helperText={errors.battery_level || 'Enter a value between 0 and 100'}
          inputProps={{ min: 0, max: 100 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {cart ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default CartForm; 