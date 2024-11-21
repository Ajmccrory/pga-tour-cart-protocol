import React from 'react';
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
} from '@mui/material';
import { Person, Role } from '../types/types';

interface PersonFormProps {
  person?: Person;
  onSubmit: () => void;
  onClose: () => void;
}

const PersonForm: React.FC<PersonFormProps> = ({ person, onSubmit, onClose }) => {
  const [formData, setFormData] = React.useState<Partial<Person>>(
    person || {
      name: '',
      role: 'volunteer',
      phone: '',
      email: '',
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = person
      ? `http://localhost:5000/persons/${person.id}`
      : 'http://localhost:5000/persons';
    const method = person ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    onSubmit();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{person ? 'Edit Staff Member' : 'New Staff Member'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as Role })
            }
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="player">Player</MenuItem>
            <MenuItem value="volunteer">Volunteer</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          margin="normal"
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