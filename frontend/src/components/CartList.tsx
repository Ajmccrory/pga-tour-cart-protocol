import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  Typography,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Edit, Delete, Timer } from '@mui/icons-material';
import { Cart } from '../types/types';
import CartForm from './CartForm';

interface CartListProps {
  carts: Cart[];
  onUpdate: () => void;
}

interface TimeUpdateDialogProps {
  open: boolean;
  cart: Cart | null;
  onClose: () => void;
  onSubmit: (checkoutTime: string, returnTime: string) => void;
}

const TimeUpdateDialog: React.FC<TimeUpdateDialogProps> = ({
  open,
  cart,
  onClose,
  onSubmit,
}) => {
  const [checkoutTime, setCheckoutTime] = useState(cart?.checkout_time || '');
  const [returnTime, setReturnTime] = useState(cart?.return_by_time || '');

  const handleSubmit = () => {
    onSubmit(checkoutTime, returnTime);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Cart Times</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          type="datetime-local"
          label="Checkout Time"
          value={checkoutTime}
          onChange={(e) => setCheckoutTime(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          type="datetime-local"
          label="Return By"
          value={returnTime}
          onChange={(e) => setReturnTime(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update Times
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CartList: React.FC<CartListProps> = ({ carts, onUpdate }) => {
  const [editCart, setEditCart] = useState<Cart | null>(null);
  const [timeUpdateCart, setTimeUpdateCart] = useState<Cart | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this cart?')) {
      await fetch(`http://localhost:5000/carts/${id}`, {
        method: 'DELETE',
      });
      onUpdate();
    }
  };

  const handleTimeUpdate = async (checkoutTime: string, returnTime: string) => {
    if (!timeUpdateCart) return;

    await fetch(`http://localhost:5000/carts/${timeUpdateCart.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...timeUpdateCart,
        checkout_time: checkoutTime,
        return_by_time: returnTime,
        status: 'in-use',
      }),
    });
    onUpdate();
    setTimeUpdateCart(null);
  };

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return 'Not set';
    return new Date(dateTime).toLocaleString();
  };

  return (
    <>
      <List>
        {carts.map((cart) => (
          <ListItem
            key={cart.id}
            secondaryAction={
              <>
                <IconButton onClick={() => setTimeUpdateCart(cart)}>
                  <Timer />
                </IconButton>
                <IconButton edge="end" onClick={() => setEditCart(cart)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(cart.id)}>
                  <Delete />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={`Cart #${cart.cart_number}`}
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    Status: {cart.status}<br />
                    Battery: {cart.battery_level}%<br />
                    Checkout: {formatDateTime(cart.checkout_time)}<br />
                    Return By: {formatDateTime(cart.return_by_time)}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={!!editCart} onClose={() => setEditCart(null)}>
        {editCart && (
          <CartForm
            cart={editCart}
            onSubmit={() => {
              onUpdate();
              setEditCart(null);
            }}
            onClose={() => setEditCart(null)}
          />
        )}
      </Dialog>

      <TimeUpdateDialog
        open={!!timeUpdateCart}
        cart={timeUpdateCart}
        onClose={() => setTimeUpdateCart(null)}
        onSubmit={handleTimeUpdate}
      />
    </>
  );
};

export default CartList; 