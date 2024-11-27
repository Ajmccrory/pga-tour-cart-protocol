/**
 * Cart Management System - Cart Return Dialog
 * @author AJ McCrory
 * @created 2024
 * @description Dialog for processing cart returns with battery level updates
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  styled,
} from '@mui/material';
import { Cart } from '../types/types';
import { api } from '../utils/api';
import BatteryGauge from './BatteryGauge';

const StyledContent = styled(DialogContent)(({ theme }) => ({
  minWidth: '400px',
  padding: theme.spacing(3),
}));

interface CartReturnDialogProps {
  open: boolean;
  cart: Cart | null;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  onError: (message: string) => void;
}

interface ReturnData {
  battery_level: number;
  notes: string;
}

const CartReturnDialog: React.FC<CartReturnDialogProps> = ({
  open,
  cart,
  onClose,
  onSubmit,
  onError,
}) => {
  const [returnData, setReturnData] = useState<ReturnData>({
    battery_level: cart?.battery_level || 100,
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleReturn = async () => {
    if (!cart) return;

    try {
      setError(null);
      
      // Record the return
      await api.returnCart(cart.id, {
        battery_level: returnData.battery_level,
        notes: returnData.notes,
        return_time: new Date().toISOString(),
      });

      await onSubmit();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to process cart return');
      }
      onError('Failed to process cart return');
    }
  };

  if (!cart) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Return Cart #{cart.cart_number}</DialogTitle>
      <StyledContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Current Battery Level
          </Typography>
          <TextField
            type="number"
            value={returnData.battery_level}
            onChange={(e) => setReturnData({
              ...returnData,
              battery_level: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
            })}
            fullWidth
            inputProps={{ min: 0, max: 100 }}
            sx={{ mb: 1 }}
          />
          <BatteryGauge level={returnData.battery_level} />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Return Notes
          </Typography>
          <TextField
            multiline
            rows={3}
            value={returnData.notes}
            onChange={(e) => setReturnData({
              ...returnData,
              notes: e.target.value
            })}
            fullWidth
            placeholder="Any issues or comments about the cart's condition?"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Checked out: {new Date(cart.checkout_time!).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Expected return: {new Date(cart.return_by_time!).toLocaleString()}
          </Typography>
        </Box>
      </StyledContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleReturn} 
          variant="contained" 
          color="primary"
        >
          Process Return
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartReturnDialog; 