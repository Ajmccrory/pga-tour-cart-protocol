/**
 * Cart Management System - Person List Component
 * @author AJ McCrory
 * @created 2024
 * @description Displays and manages staff members list with POS-style design
 */

import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  Typography,
  Box,
  styled,
  Tooltip,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Edit, Delete, Email, Phone, Badge } from '@mui/icons-material';
import { Person, Cart } from '../types/types';
import PersonForm from './PersonForm';
import { api } from '../utils/api';
import { displayErrorMessage } from '../utils/errorHandling';
import { ROLE_LABELS } from '../types/roles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const RoleChip = styled(Chip)<{ role: string }>(({ theme, role }) => {
  const colors = {
    admin: theme.palette.error.main,
    volunteer: theme.palette.info.main,
  };
  return {
    backgroundColor: colors[role as keyof typeof colors],
    color: theme.palette.common.white,
    fontWeight: 'bold',
  };
});

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  margin: theme.spacing(0.5),
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

interface PersonListProps {
  persons: Person[];
  onUpdate: () => Promise<void>;
  onError: (message: string) => void;
}

const PersonList: React.FC<PersonListProps> = ({ persons, onUpdate, onError }) => {
  const [editPerson, setEditPerson] = useState<Person | null>(null);

  const handleDelete = async (personId: number) => {
    try {
      if (window.confirm('Are you sure you want to delete this staff member?')) {
        await api.deletePerson(personId);
        await onUpdate();
      }
    } catch (error) {
      onError(displayErrorMessage(error));
    }
  };

  return (
    <>
      <List>
        {persons.map((person) => (
          <ListItem
            key={person.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <ListItemText
              primary={person.name}
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    Role: {ROLE_LABELS[person.role]}<br />
                    Email: {person.email}<br />
                    Phone: {person.phone}
                  </Typography>
                  {person.assigned_carts.length > 0 && (
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Typography variant="subtitle2" color="primary">
                        Assigned Carts:
                      </Typography>
                      {person.assigned_carts.map((cart: Cart) => (
                        <Typography key={cart.id} variant="body2" color="text.secondary">
                          Cart #{cart.cart_number}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </>
              }
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Tooltip title="Edit Staff Member">
                <ActionButton size="small" onClick={() => setEditPerson(person)}>
                  <Edit />
                </ActionButton>
              </Tooltip>
              <Tooltip title="Delete Staff Member">
                <ActionButton size="small" onClick={() => handleDelete(person.id)}>
                  <Delete />
                </ActionButton>
              </Tooltip>
            </Box>
          </ListItem>
        ))}
      </List>

      <Dialog open={!!editPerson} onClose={() => setEditPerson(null)}>
        {editPerson && (
          <PersonForm
            person={editPerson}
            onSubmit={onUpdate}
            onClose={() => setEditPerson(null)}
            onError={onError}
          />
        )}
      </Dialog>
    </>
  );
};

export default PersonList; 