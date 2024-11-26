/**
 * Cart Management System - Battery Gauge Component
 * @author AJ McCrory
 * @created 2024
 * @description Visual battery level indicator
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Battery20, Battery50, Battery80, BatteryFull } from '@mui/icons-material';

interface BatteryGaugeProps {
  level: number;
}

const BatteryGauge: React.FC<BatteryGaugeProps> = ({ level }) => {
  const getBatteryColor = (level: number) => {
    if (level > 70) return '#4caf50';
    if (level > 30) return '#ff9800';
    return '#f44336';
  };

  const getBatteryIcon = (level: number) => {
    if (level > 80) return <BatteryFull sx={{ color: getBatteryColor(level) }} />;
    if (level > 50) return <Battery80 sx={{ color: getBatteryColor(level) }} />;
    if (level > 20) return <Battery50 sx={{ color: getBatteryColor(level) }} />;
    return <Battery20 sx={{ color: getBatteryColor(level) }} />;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {getBatteryIcon(level)}
      <Typography variant="body2" sx={{ color: getBatteryColor(level) }}>
        {level}%
      </Typography>
    </Box>
  );
};

export default BatteryGauge; 