/**
 * Cart Management System - Dashboard Component
 * @author AJ McCrory
 * @created 2024
 * @description Dashboard showing cart statistics and status overview
 */

import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Cart } from '../types/types';
import { CART_STATUS_LABELS } from '../types/cartStatus';

interface DashboardProps {
  carts: Cart[];
  loading?: boolean;
  error?: string | null;
}

interface StatCardProps {
  title: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
  <Paper
    sx={{
      p: 2,
      bgcolor: color,
      color: 'white',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Typography variant="h3">{value}</Typography>
    <Typography variant="subtitle1">{title}</Typography>
  </Paper>
);

const Dashboard: React.FC<DashboardProps> = ({ carts, loading, error }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  const stats = {
    available: carts.filter(cart => cart.status === 'available').length,
    inUse: carts.filter(cart => cart.status === 'in-use').length,
    maintenance: carts.filter(cart => cart.status === 'maintenance').length,
  };

  const lowBattery = carts.filter(cart => cart.battery_level < 20).length;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={CART_STATUS_LABELS.available}
            value={stats.available}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={CART_STATUS_LABELS['in-use']}
            value={stats.inUse}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={CART_STATUS_LABELS.maintenance}
            value={stats.maintenance}
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Battery"
            value={lowBattery}
            color="#ff9800"
          />
        </Grid>
      </Grid>

      {lowBattery > 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {lowBattery} cart(s) have low battery levels (below 20%)
        </Alert>
      )}
    </Box>
  );
};

export default Dashboard; 