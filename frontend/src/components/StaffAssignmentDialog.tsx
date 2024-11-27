/**
 * Cart Management System - Staff Assignment Dialog
 * @author AJ McCrory
 * @created 2024
 * @description Dialog for assigning staff members to carts
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { Person } from '../types/types';
import { api } from '../utils/api';
import PersonForm from './PersonForm';

interface StaffAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onAssign: (personId: number) => void;
  onError: (message: string) => void;
}

const StaffAssignmentDialog: React.FC<StaffAssignmentDialogProps> = ({
  open,
  onClose,
  onAssign,
  onError,
}) => {
  const [staff, setStaff] = useState<Person[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<number | ''>('');
  const [showNewStaffForm, setShowNewStaffForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchStaff();
    }
  }, [open]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await api.getPersons();
      setStaff(data);
    } catch (error) {
      onError('Failed to fetch staff members');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = () => {
    if (selectedStaffId !== '') {
      onAssign(selectedStaffId as number);
    }
  };

  const handleNewStaffCreated = async () => {
    await fetchStaff();
    setShowNewStaffForm(false);
  };

  if (showNewStaffForm) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md">
        <PersonForm
          onSubmit={handleNewStaffCreated}
          onClose={() => setShowNewStaffForm(false)}
          onError={onError}
          defaultRole="volunteer"
        />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assign Staff Member</DialogTitle>
      <DialogContent>
        {staff.length === 0 && !loading ? (
          <Box sx={{ mb: 2 }}>
            <Alert severity="info">
              No staff members available. Would you like to create a new volunteer?
            </Alert>
          </Box>
        ) : (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Staff Member</InputLabel>
            <Select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value as number)}
              label="Select Staff Member"
            >
              {staff.map((person) => (
                <MenuItem key={person.id} value={person.id}>
                  {person.name} ({person.role})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {staff.length === 0 && !loading ? (
          <Button
            onClick={() => setShowNewStaffForm(true)}
            variant="contained"
            color="primary"
          >
            Create New Volunteer
          </Button>
        ) : (
          <Button
            onClick={handleAssign}
            variant="contained"
            color="primary"
            disabled={selectedStaffId === ''}
          >
            Assign Staff
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default StaffAssignmentDialog; 