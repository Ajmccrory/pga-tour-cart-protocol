/**
 * Cart Management System - Bulk Delete Dialog
 * @author AJ McCrory
 * @created 2024
 * @description Dialog for confirming and handling bulk cart deletion
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from '@mui/material';

interface BulkDeleteDialogProps {
  open: boolean;
  cartCount: number;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const BulkDeleteDialog: React.FC<BulkDeleteDialogProps> = ({
  open,
  cartCount,
  onClose,
  onConfirm,
}) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete All Carts</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone!
        </Alert>
        <Typography>
          Are you sure you want to delete all {cartCount} carts? This action cannot be reversed.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Delete All Carts
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkDeleteDialog; 