/**
 * Cart Management System - Cart List Component
 * @author AJ McCrory
 * @created 2024
 * @description Displays and manages a list of carts with CRUD operations
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
import { Edit, Delete, Timer } from '@mui/icons-material';
import { Cart } from '../types/types';
import CartForm from './CartForm';
import TimeUpdateDialog from './TimeUpdateDialog';
import { displayErrorMessage } from '../utils/errorHandling';
import { api } from '../utils/api';

interface CartListProps {
  carts: Cart[];
  onUpdate: () => void;
  onError: (message: string) => void;
}

/**
 * CartList component for displaying and managing carts
 */
const CartList: React.FC<CartListProps> = ({ carts, onUpdate, onError }) => {
  const [editCart, setEditCart] = useState<Cart | null>(null);
  const [timeUpdateCart, setTimeUpdateCart] = useState<Cart | null>(null);

  /**
   * Formats date time for display
   */
  const formatDateTime = (dateTime: string | null): string => {
    if (!dateTime) return 'Not set';
    return new Date(dateTime).toLocaleString();
  };

  /**
   * Handles cart deletion
   */
  const handleDelete = async (id: number) => {
    try {
      if (window.confirm('Are you sure you want to delete this cart?')) {
        await api.deleteCart(id);
        onUpdate();
      }
    } catch (error) {
      onError(displayErrorMessage(error));
    }
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

      {/* Edit Dialog */}
      <Dialog open={!!editCart} onClose={() => setEditCart(null)}>
        {editCart && (
          <CartForm
            cart={editCart}
            onSubmit={() => {
              onUpdate();
              setEditCart(null);
            }}
            onClose={() => setEditCart(null)}
            onError={onError}
          />
        )}
      </Dialog>

      {/* Time Update Dialog */}
      <TimeUpdateDialog
        open={!!timeUpdateCart}
        cart={timeUpdateCart}
        onClose={() => setTimeUpdateCart(null)}
        onSubmit={onUpdate}
        onError={onError}
      />
    </>
  );
};

export default CartList; 