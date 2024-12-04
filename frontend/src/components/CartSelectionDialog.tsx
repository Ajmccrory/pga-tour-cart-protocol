import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  Box,
  Alert,
  styled,
} from '@mui/material';
import { Cart } from '../types/types';
import { api } from '../utils/api';

const StyledList = styled(List)(({ theme }) => ({
  maxHeight: '60vh',
  overflow: 'auto',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

interface CartSelectionDialogProps {
  open: boolean;
  carts: Cart[];
  onClose: () => void;
  onSubmit: () => Promise<void>;
  onError: (message: string) => void;
}

const CartSelectionDialog: React.FC<CartSelectionDialogProps> = ({
  open,
  carts,
  onClose,
  onSubmit,
  onError,
}) => {
  const [selectedCarts, setSelectedCarts] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleToggleCart = (cartId: number) => {
    setSelectedCarts(prev => 
      prev.includes(cartId) 
        ? prev.filter(id => id !== cartId)
        : [...prev, cartId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCarts(carts.map(cart => cart.id));
  };

  const handleClearSelection = () => {
    setSelectedCarts([]);
  };

  const handleDelete = async () => {
    if (!selectedCarts.length) {
      setError('Please select at least one cart to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedCarts.length} carts?`)) {
      return;
    }

    try {
      await api.deleteSelectedCarts(selectedCarts);
      await onSubmit();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to delete carts');
      }
      onError('Failed to delete selected carts');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Carts to Delete</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button variant="outlined" onClick={handleClearSelection}>
            Clear Selection
          </Button>
          <Box sx={{ ml: 'auto', alignSelf: 'center' }}>
            <Typography component="div" variant="body2">
              {selectedCarts.length} carts selected
            </Typography>
          </Box>
        </Box>

        <StyledList>
          {carts.map((cart) => (
            <ListItem key={cart.id} dense button onClick={() => handleToggleCart(cart.id)}>
              <Checkbox
                edge="start"
                checked={selectedCarts.includes(cart.id)}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText
                primary={
                  <Typography component="div">
                    Cart #{cart.cart_number}
                  </Typography>
                }
                secondary={
                  <Typography component="div" variant="body2" color="text.secondary">
                    Status: {cart.status} | Battery: {cart.battery_level}%
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </StyledList>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={!selectedCarts.length}
        >
          Delete Selected ({selectedCarts.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartSelectionDialog; 