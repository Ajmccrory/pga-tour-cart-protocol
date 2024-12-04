/**
 * Cart Management System - Person List Component
 * @author AJ McCrory
 * @created 2024
 * @description Displays and manages a list of staff members
 */

import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  Box,
  Typography,
  styled,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Person } from '../types/types';
import PersonForm from './PersonForm';
import { ROLE_LABELS } from '../types/roles';
import { api } from '../utils/api';
import { displayErrorMessage } from '../utils/errorHandling';

interface PersonListProps {
  persons: Person[];
  onUpdate: () => Promise<void>;
  onError: (message: string) => void;
}

const PersonList: React.FC<PersonListProps> = ({ persons, onUpdate, onError }) => {
  const [editPerson, setEditPerson] = useState<Person | null>(null);

  const handleDelete = async (id: number) => {
    try {
      if (window.confirm('Are you sure you want to delete this staff member?')) {
        await api.deletePerson(id);
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
            secondaryAction={
              <Box>
                <IconButton onClick={() => setEditPerson(person)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(person.id)}>
                  <Delete />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={person.name}
              secondary={
                <Box component="div">
                  <Typography component="div" variant="body2">
                    Role: {ROLE_LABELS[person.role]}
                  </Typography>
                  <Typography component="div" variant="body2">
                    Email: {person.email}
                  </Typography>
                  <Typography component="div" variant="body2">
                    Phone: {person.phone}
                  </Typography>
                  {person.assigned_carts.length > 0 && (
                    <Box component="div" sx={{ mt: 2 }}>
                      <Typography component="div" variant="subtitle2" color="primary">
                        Assigned Carts:
                      </Typography>
                      {person.assigned_carts.map((cart) => (
                        <Typography 
                          key={cart.id} 
                          component="div"
                          variant="body2" 
                          color="text.secondary"
                        >
                          Cart #{cart.cart_number}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              }
            />
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