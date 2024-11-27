/**
 * Cart Management System - Person Form Component
 * @author AJ McCrory
 * @created 2024
 * @description Form for creating and editing staff members
 */

import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Person } from '../types/types';
import { Role, ROLE_LABELS } from '../types/roles';
import { api } from '../utils/api';
import { RequestError } from '../utils/errorHandling';
import { Person as PersonIcon, Email, Phone, Badge } from '@mui/icons-material';

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

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
}));

interface PersonFormProps {
  person?: Person;
  defaultRole?: Role;
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
  defaultRole = 'volunteer',
  onSubmit,
  onClose,
  onError,
}) => {
  const [formData, setFormData] = useState<Partial<Person>>(() => {
    if (person) {
      return person;
    }
    
    return {
      name: '',
      role: defaultRole,
      phone: '',
      email: '',
    };
  });

  useEffect(() => {
    if (!person) {
      setFormData(prev => ({
        ...prev,
        role: defaultRole,
      }));
    }
  }, [defaultRole, person]);

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    // Phone validation
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
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
    } catch (error) {
      if (error instanceof RequestError) {
        if (error.message.includes('name already exists')) {
          setErrors({ name: error.message });
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
        {person ? 'Edit Staff Member' : 'New Staff Member'}
      </DialogTitle>
      <StyledDialogContent>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.general}
          </Alert>
        )}

        <StyledPaper>
          <FormSection>
            <IconWrapper>
              <PersonIcon />
              <Typography variant="subtitle2">Personal Information</Typography>
            </IconWrapper>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                startAdornment={<Badge sx={{ mr: 1 }} />}
              >
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormSection>

          <FormSection>
            <IconWrapper>
              <Email />
              <Typography variant="subtitle2">Contact Information</Typography>
            </IconWrapper>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={!!errors.phone}
              helperText={errors.phone || 'Format: +1234567890'}
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </FormSection>
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
          {person ? 'Update Staff Member' : 'Create Staff Member'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default PersonForm; 