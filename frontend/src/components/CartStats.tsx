import React from 'react';
import { Grid, Typography, Box } from '@mui/material';

interface CartStatsProps {
  available: number;
  inUse: number;
  maintenance: number;
}

const CartStats: React.FC<CartStatsProps> = ({ available, inUse, maintenance }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Cart Status Overview
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box sx={{ p: 2, bgcolor: '#4caf50', color: 'white', borderRadius: 1 }}>
            <Typography variant="h4">{available}</Typography>
            <Typography>Available</Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ p: 2, bgcolor: '#2196f3', color: 'white', borderRadius: 1 }}>
            <Typography variant="h4">{inUse}</Typography>
            <Typography>In Use</Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ p: 2, bgcolor: '#f44336', color: 'white', borderRadius: 1 }}>
            <Typography variant="h4">{maintenance}</Typography>
            <Typography>Maintenance</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartStats; 