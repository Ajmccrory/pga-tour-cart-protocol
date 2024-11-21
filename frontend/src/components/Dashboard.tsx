import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import CartStats from './CartStats';
import BatteryGauge from './BatteryGauge';
import { Cart } from '../types/types';

interface DashboardProps {
  carts: Cart[];
}

const Dashboard: React.FC<DashboardProps> = ({ carts }) => {
  const availableCarts = carts.filter(cart => cart.status === 'available').length;
  const inUseCarts = carts.filter(cart => cart.status === 'in-use').length;
  const maintenanceCarts = carts.filter(cart => cart.status === 'maintenance').length;
  
  const averageBattery = carts.reduce((acc, cart) => acc + cart.battery_level, 0) / carts.length;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <CartStats
            available={availableCarts}
            inUse={inUseCarts}
            maintenance={maintenanceCarts}
          />
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Average Battery Level
          </Typography>
          <BatteryGauge level={averageBattery} />
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Carts Due Soon
          </Typography>
          {carts
            .filter(cart => cart.status === 'in-use' && cart.return_by_time)
            .sort((a, b) => new Date(a.return_by_time!).getTime() - new Date(b.return_by_time!).getTime())
            .slice(0, 5)
            .map(cart => (
              <Typography key={cart.id}>
                Cart #{cart.cart_number} - Due: {new Date(cart.return_by_time!).toLocaleString()}
              </Typography>
            ))}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard; 