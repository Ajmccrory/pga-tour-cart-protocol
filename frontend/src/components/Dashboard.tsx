/**
 * Cart Management System - Dashboard Component
 * @author AJ McCrory
 * @created 2024
 * @description POS-style dashboard for cart management
 */

import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
  styled,
  Dialog,
  Button,
} from '@mui/material';
import { Cart } from '../types/types';
import { CART_STATUS_LABELS, CartStatus } from '../types/cartStatus';
import BatteryGauge from './BatteryGauge';
import CartForm from './CartForm';

interface DashboardProps {
  carts: Cart[];
  loading?: boolean;
  error?: string | null;
  onUpdate: () => Promise<void>;
  onError: (message: string) => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const StatusButton = styled(Button)<{ active?: boolean; statuscolor: string }>(({ theme, active, statuscolor }) => ({
  flex: 1,
  padding: theme.spacing(2),
  backgroundColor: active ? statuscolor : theme.palette.background.paper,
  color: active ? theme.palette.common.white : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: active ? statuscolor : theme.palette.action.hover,
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.2s',
  boxShadow: active ? theme.shadows[4] : theme.shadows[1],
}));

const StatusBadge = styled(Box)<{ status: string }>(({ theme, status }) => {
  const colors = {
    available: '#4caf50',
    'in-use': '#2196f3',
    maintenance: '#f44336',
  };
  return {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: '4px 12px',
    borderRadius: '12px',
    backgroundColor: colors[status as keyof typeof colors],
    color: 'white',
    fontWeight: 'bold',
  };
});

const Dashboard: React.FC<DashboardProps> = ({ 
  carts, 
  loading, 
  error,
  onUpdate,
  onError 
}) => {
  const theme = useTheme();
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<CartStatus | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return theme.palette.success.main;
      case 'in-use':
        return theme.palette.info.main;
      case 'maintenance':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const handleCartClick = (cart: Cart) => {
    setSelectedCart(cart);
  };

  const handleDialogClose = () => {
    setSelectedCart(null);
  };

  const filteredCarts = selectedStatus 
    ? carts.filter(cart => cart.status === selectedStatus)
    : carts;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Status Filter Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {Object.entries(CART_STATUS_LABELS).map(([status, label]) => {
              const statusCarts = carts.filter(cart => cart.status === status);
              const statusColor = getStatusColor(status);
              return (
                <StatusButton
                  key={status}
                  onClick={() => setSelectedStatus(selectedStatus === status ? null : status as CartStatus)}
                  active={selectedStatus === status}
                  statuscolor={statusColor}
                >
                  <Box>
                    <Typography variant="h4" component="div">
                      {statusCarts.length}
                    </Typography>
                    <Typography variant="subtitle1">
                      {label}
                    </Typography>
                  </Box>
                </StatusButton>
              );
            })}
          </Box>
        </Grid>

        {/* Cart Grid */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {filteredCarts.map((cart) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cart.id}>
                <StyledCard onClick={() => handleCartClick(cart)}>
                  <CardContent sx={{ position: 'relative', minHeight: '200px' }}>
                    <StatusBadge status={cart.status}>
                      {CART_STATUS_LABELS[cart.status as keyof typeof CART_STATUS_LABELS]}
                    </StatusBadge>
                    
                    <Typography variant="h5" gutterBottom>
                      Cart #{cart.cart_number}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <BatteryGauge level={cart.battery_level} />
                    </Box>

                    {cart.status === 'in-use' && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Checkout: {new Date(cart.checkout_time!).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Return By: {new Date(cart.return_by_time!).toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Edit Cart Dialog */}
      <Dialog 
        open={!!selectedCart} 
        onClose={handleDialogClose}
        maxWidth="md"
      >
        {selectedCart && (
          <CartForm
            cart={selectedCart}
            onSubmit={async () => {
              await onUpdate();
              handleDialogClose();
            }}
            onClose={handleDialogClose}
            onError={onError}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default Dashboard; 