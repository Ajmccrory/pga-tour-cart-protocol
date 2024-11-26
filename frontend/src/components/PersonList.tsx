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
} from '@mui/material';
import { Edit, Delete, Email, Phone, Badge } from '@mui/icons-material';
import { Person } from '../types/types';
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
      <Grid container spacing={3}>
        {persons.map((person) => (
          <Grid item xs={12} sm={6} md={4} key={person.id}>
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {person.name}
                  </Typography>
                  <RoleChip
                    label={ROLE_LABELS[person.role]}
                    role={person.role}
                    size="small"
                    icon={<Badge />}
                  />
                </Box>

                <ContactInfo>
                  <Email fontSize="small" />
                  <Typography variant="body2">
                    {person.email || 'No email provided'}
                  </Typography>
                </ContactInfo>

                <ContactInfo>
                  <Phone fontSize="small" />
                  <Typography variant="body2">
                    {person.phone || 'No phone provided'}
                  </Typography>
                </ContactInfo>

                {person.active_cart.length > 0 && (
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="subtitle2" color="primary">
                      Active Carts:
                    </Typography>
                    {person.active_cart.map((cart) => (
                      <Typography key={cart.id} variant="body2" color="text.secondary">
                        Cart #{cart.cart_number}
                      </Typography>
                    ))}
                  </Box>
                )}

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
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

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