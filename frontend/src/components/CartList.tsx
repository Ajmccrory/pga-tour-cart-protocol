/**
 * Cart Management System - Cart List Component
 * @author AJ McCrory
 * @created 2024
 * @description Displays and manages a list of carts with CRUD operations
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
import { Edit, Delete, Timer, History, Battery20, Battery50, Battery80, BatteryFull, AssignmentReturn } from '@mui/icons-material';
import { Cart } from '../types/types';
import CartForm from './CartForm';
import TimeUpdateDialog from './TimeUpdateDialog';
import { displayErrorMessage } from '../utils/errorHandling';
import { api } from '../utils/api';
import { CART_STATUS_LABELS } from '../types/cartStatus';
import CartHistoryDialog from './CartHistoryDialog';
import CartReturnDialog from './CartReturnDialog';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
  const colors = {
    available: theme.palette.success.main,
    'in-use': theme.palette.info.main,
    maintenance: theme.palette.error.main,
  };
  return {
    backgroundColor: colors[status as keyof typeof colors],
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

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(2),
}));

interface CartListProps {
  carts: Cart[];
  onUpdate: () => Promise<void>;
  onError: (message: string) => void;
}

const CartList: React.FC<CartListProps> = ({ carts, onUpdate, onError }) => {
  const [editCart, setEditCart] = useState<Cart | null>(null);
  const [timeUpdateCart, setTimeUpdateCart] = useState<Cart | null>(null);
  const [historyCart, setHistoryCart] = useState<Cart | null>(null);
  const [returnCart, setReturnCart] = useState<Cart | null>(null);

  const getBatteryIcon = (level: number) => {
    if (level > 80) return <BatteryFull color="success" />;
    if (level > 50) return <Battery80 color="info" />;
    if (level > 20) return <Battery50 color="warning" />;
    return <Battery20 color="error" />;
  };

  const formatDateTime = (dateTime: string | null | undefined): string => {
    if (!dateTime) return 'Not set';
    return new Date(dateTime).toLocaleString();
  };

  const handleDelete = async (id: number) => {
    try {
      if (window.confirm('Are you sure you want to delete this cart?')) {
        await api.deleteCart(id);
        await onUpdate();
      }
    } catch (error) {
      onError(displayErrorMessage(error));
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {carts.map((cart) => (
          <Grid item xs={12} sm={6} md={4} key={cart.id}>
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Cart #{cart.cart_number}
                  </Typography>
                  <StatusChip
                    label={CART_STATUS_LABELS[cart.status as keyof typeof CART_STATUS_LABELS]}
                    status={cart.status}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getBatteryIcon(cart.battery_level)}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {cart.battery_level}%
                  </Typography>
                </Box>

                {cart.status === 'in-use' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Checkout: {formatDateTime(cart.checkout_time)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Return By: {formatDateTime(cart.return_by_time)}
                    </Typography>
                  </Box>
                )}

                <ActionButtons>
                  {cart.status === 'in-use' && (
                    <Tooltip title="Return Cart">
                      <ActionButton onClick={() => setReturnCart(cart)}>
                        <AssignmentReturn />
                      </ActionButton>
                    </Tooltip>
                  )}
                  <Tooltip title="View History">
                    <ActionButton onClick={() => setHistoryCart(cart)}>
                      <History />
                    </ActionButton>
                  </Tooltip>
                  <Tooltip title="Update Times">
                    <ActionButton onClick={() => setTimeUpdateCart(cart)}>
                      <Timer />
                    </ActionButton>
                  </Tooltip>
                  <Tooltip title="Edit Cart">
                    <ActionButton onClick={() => setEditCart(cart)}>
                      <Edit />
                    </ActionButton>
                  </Tooltip>
                  <Tooltip title="Delete Cart">
                    <ActionButton onClick={() => handleDelete(cart.id)}>
                      <Delete />
                    </ActionButton>
                  </Tooltip>
                </ActionButtons>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!editCart} onClose={() => setEditCart(null)}>
        {editCart && (
          <CartForm
            cart={editCart}
            onSubmit={async () => {
              await onUpdate();
            }}
            onClose={() => setEditCart(null)}
            onError={onError}
          />
        )}
      </Dialog>

      <TimeUpdateDialog
        open={!!timeUpdateCart}
        cart={timeUpdateCart}
        onClose={() => setTimeUpdateCart(null)}
        onSubmit={onUpdate}
        onError={onError}
      />

      <CartHistoryDialog
        open={!!historyCart}
        cart={historyCart}
        onClose={() => setHistoryCart(null)}
        onError={onError}
      />

      <CartReturnDialog
        open={!!returnCart}
        cart={returnCart}
        onClose={() => setReturnCart(null)}
        onSubmit={onUpdate}
        onError={onError}
      />
    </>
  );
};

export default CartList; 