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
import { Cart } from '../types/types';

interface CartFormProps {
  cart?: Cart;
  onSubmit: () => void;
  onClose: () => void;
}

type CartStatus = 'available' | 'in-use' | 'maintenance';

const CartForm: React.FC<CartFormProps> = ({ cart, onSubmit, onClose }) => {
  const [formData, setFormData] = React.useState<Partial<Cart>>(
    cart || {
      cart_number: '',
      status: 'available' as CartStatus,
      battery_level: 100,
      checkout_time: null,
      return_by_time: null,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = cart
      ? `http://localhost:5000/carts/${cart.id}`
      : 'http://localhost:5000/carts';
    const method = cart ? 'PUT' : 'POST';

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
      <DialogTitle>{cart ? 'Edit Cart' : 'New Cart'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Cart Number"
          value={formData.cart_number}
          onChange={(e) =>
            setFormData({ ...formData, cart_number: e.target.value })
          }
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as CartStatus })
            }
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="in-use">In Use</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          type="number"
          label="Battery Level"
          value={formData.battery_level}
          onChange={(e) =>
            setFormData({
              ...formData,
              battery_level: parseInt(e.target.value),
            })
          }
          margin="normal"
        />
        {formData.status === 'in-use' && (
          <>
            <TextField
              fullWidth
              type="datetime-local"
              label="Checkout Time"
              value={formData.checkout_time || ''}
              onChange={(e) =>
                setFormData({ ...formData, checkout_time: e.target.value })
              }
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="Return By"
              value={formData.return_by_time || ''}
              onChange={(e) =>
                setFormData({ ...formData, return_by_time: e.target.value })
              }
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {cart ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default CartForm; 