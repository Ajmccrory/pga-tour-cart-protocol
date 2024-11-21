import React from 'react';
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

interface PersonListProps {
  persons: Person[];
  onUpdate: () => void;
}

const PersonList: React.FC<PersonListProps> = ({ persons, onUpdate }) => {
  const [editPerson, setEditPerson] = React.useState<Person | null>(null);

  const handleDelete = async (id: string) => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this person?')) {
      await fetch(`http://localhost:5000/persons/${id}`, {
        method: 'DELETE',
      });
      onUpdate();
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
                <IconButton edge="end" onClick={() => setEditPerson(person)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" onClick={() => person.id && handleDelete(person.id)}>
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
                    Role: {person.role}<br />
                    Email: {person.email}<br />
                    Phone: {person.phone}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={!!editPerson} onClose={() => setEditPerson(null)}>
        {editPerson && (
          <PersonForm
            person={editPerson}
            onSubmit={() => {
              onUpdate();
              setEditPerson(null);
            }}
            onClose={() => setEditPerson(null)}
          />
        )}
      </Dialog>
    </>
  );
};

export default PersonList; 