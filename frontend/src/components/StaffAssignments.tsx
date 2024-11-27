/**
 * Cart Management System - Staff Assignments Component
 * @author AJ McCrory
 * @created 2024
 * @description Displays and manages staff assignments for a cart
 */

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  styled,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Person, PersonRemove } from '@mui/icons-material';
import { Person as PersonType } from '../types/types';

const StaffChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '& .MuiChip-icon': {
    color: 'inherit',
  },
}));

interface StaffAssignmentsProps {
  assignedStaff: PersonType[];
  onAssign: () => void;
  onUnassign: (personId: number) => void;
  maxAssignments?: number;
}

const StaffAssignments: React.FC<StaffAssignmentsProps> = ({
  assignedStaff,
  onAssign,
  onUnassign,
  maxAssignments = 2,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Assigned Staff ({assignedStaff.length}/{maxAssignments})
        </Typography>
        {assignedStaff.length < maxAssignments && (
          <Button
            size="small"
            startIcon={<Person />}
            onClick={onAssign}
            variant="outlined"
          >
            Assign Staff
          </Button>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {assignedStaff.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No staff assigned
          </Typography>
        ) : (
          assignedStaff.map((person) => (
            <StaffChip
              key={person.id}
              label={person.name}
              onDelete={() => onUnassign(person.id)}
              deleteIcon={
                <Tooltip title="Remove Assignment">
                  <PersonRemove />
                </Tooltip>
              }
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default StaffAssignments; 