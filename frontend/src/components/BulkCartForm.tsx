/**
 * Cart Management System - Bulk Cart Form Component
 * @author AJ McCrory
 * @created 2024
 * @description Form for creating multiple carts at once
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
  Typography,
  Slider,
} from '@mui/material';
import { Cart } from '../types/types';
import { api } from '../utils/api';
import { CartStatus, CART_STATUS_LABELS } from '../types/cartStatus';
import { RequestError, displayErrorMessage } from '../utils/errorHandling';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

interface BulkCartFormProps {
  onSubmit: () => void;
  onClose: () => void;
  onError: (message: string) => void;
}

interface ValidationErrors {
  prefix?: string;
  count?: string;
  general?: string;
}

const BulkCartForm: React.FC<BulkCartFormProps> = ({
  onSubmit,
  onClose,
  onError,
}) => {
  const [formData, setFormData] = useState({
    prefix: '',
    startNumber: 1,
    count: 10,
    status: 'available' as CartStatus,
    battery_level: 100,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!formData.prefix?.trim()) {
      newErrors.prefix = 'Cart number prefix is required';
      isValid = false;
    } else if (!/^[A-Za-z0-9-]+$/.test(formData.prefix)) {
      newErrors.prefix = 'Prefix can only contain letters, numbers, and hyphens';
      isValid = false;
    }

    if (formData.count < 1 || formData.count > 50) {
      newErrors.count = 'Number of carts must be between 1 and 50';
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
      await api.createBulkCarts({
        prefix: formData.prefix,
        startNumber: formData.startNumber,
        count: formData.count,
        status: formData.status,
        battery_level: formData.battery_level
      });
      
      onSubmit();
      onClose();
    } catch (error) {
      if (error instanceof RequestError) {
        if (error.message.includes('already exists')) {
          setErrors({ prefix: 'One or more cart numbers already exist' });
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
      <DialogTitle>Create Multiple Carts</DialogTitle>
      <DialogContent>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.general}
          </Alert>
        )}

        <StyledPaper>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Cart Number Prefix"
              value={formData.prefix}
              onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
              required
              error={!!errors.prefix}
              helperText={errors.prefix || 'Example: CART will create CART-001, CART-002, etc.'}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="number"
              label="Start Number"
              value={formData.startNumber}
              onChange={(e) => setFormData({ ...formData, startNumber: parseInt(e.target.value) })}
              sx={{ mb: 2 }}
            />

            <Typography gutterBottom>Number of Carts: {formData.count}</Typography>
            <Slider
              value={formData.count}
              onChange={(_, value) => setFormData({ ...formData, count: value as number })}
              min={1}
              max={50}
              marks={[
                { value: 1, label: '1' },
                { value: 10, label: '10' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
              ]}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Initial Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as CartStatus })}
                label="Initial Status"
              >
                {Object.entries(CART_STATUS_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="number"
              label="Initial Battery Level"
              value={formData.battery_level}
              onChange={(e) => setFormData({ ...formData, battery_level: parseInt(e.target.value) })}
              inputProps={{ min: 0, max: 100 }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            Preview: {formData.prefix}-{formData.startNumber.toString().padStart(3, '0')} to{' '}
            {formData.prefix}-{(formData.startNumber + formData.count - 1).toString().padStart(3, '0')}
          </Typography>
        </StyledPaper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          Create {formData.count} Carts
        </Button>
      </DialogActions>
    </form>
  );
};

export default BulkCartForm; 