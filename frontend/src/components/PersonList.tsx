/**
 * Cart Management System - Person List Component
 * @author AJ McCrory
 * @created 2024
 * @description Displays and manages staff members list with CRUD operations
 */

import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  Typography,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Person } from '../types/types';
import PersonForm from './PersonForm';
import { api } from '../utils/api';
import { displayErrorMessage } from '../utils/errorHandling';
import { ROLE_LABELS } from '../types/roles';

interface PersonListProps {
  persons: Person[];
  onUpdate: () => void;
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
      console.error('Delete person error:', error);
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
              <>
                <IconButton 
                  onClick={() => setEditPerson(person)}
                  aria-label="edit"
                >
                  <Edit />
                </IconButton>
                <IconButton 
                  onClick={() => handleDelete(person.id)}
                  aria-label="delete"
                >
                  <Delete />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={person.name}
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    Role: {ROLE_LABELS[person.role]}<br />
                    Email: {person.email}<br />
                    Phone: {person.phone || 'N/A'}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      <Dialog 
        open={!!editPerson} 
        onClose={() => setEditPerson(null)}
        aria-labelledby="edit-person-dialog"
      >
        {editPerson && (
          <PersonForm
            person={editPerson}
            onSubmit={async () => {
              await onUpdate();
              setEditPerson(null);
            }}
            onClose={() => setEditPerson(null)}
            onError={onError}
          />
        )}
      </Dialog>
    </>
  );
};

export default PersonList; 