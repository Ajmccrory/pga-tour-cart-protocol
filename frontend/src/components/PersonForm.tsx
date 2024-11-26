/**
 * Cart Management System - Person Form Component
 * @author AJ McCrory
 * @created 2024
 * @description Form for creating and editing staff members with validation
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
  FormHelperText,
  Alert,
} from '@mui/material';
import { Person } from '../types/types';
import { Role, ROLE_LABELS } from '../types/roles';
import { api } from '../utils/api';

interface PersonFormProps {
  person?: Person;
  onSubmit: () => void;
  onClose: () => void;
  onError: (message: string) => void;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  general?: string;
}

const PersonForm: React.FC<PersonFormProps> = ({
  person,
  onSubmit,
  onClose,
  onError,
}) => {
  const [formData, setFormData] = useState<Partial<Person>>(
    person || {
      name: '',
      role: 'volunteer',
      phone: '',
      email: '',
    }
  );

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Email is optional
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Phone is optional
    const pattern = /^\+?1?\d{9,15}$/;
    return pattern.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    // Phone validation
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number format (e.g., +11234567890)';
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
      if (person) {
        await api.updatePerson(person.id, formData);
      } else {
        await api.createPerson(formData);
      }
      onSubmit();
      onClose();
    } catch (error: any) {
      // Handle API errors
      if (error.message.includes('full name already exists')) {
        setErrors({ name: 'A person with this full name already exists' });
      } else {
        setErrors({ general: error.message });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {person ? 'Edit Staff Member' : 'New Staff Member'}
      </DialogTitle>
      <DialogContent>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
          required
          error={!!errors.name}
          helperText={errors.name}
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Role</InputLabel>
          <Select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
          >
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          margin="normal"
          error={!!errors.phone}
          helperText={errors.phone || 'Format: +11234567890'}
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          margin="normal"
          error={!!errors.email}
          helperText={errors.email}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {person ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default PersonForm; 