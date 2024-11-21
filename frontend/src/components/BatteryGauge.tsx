import React from 'react';
import { Box, Typography } from '@mui/material';

interface BatteryGaugeProps {
  level: number;
}

interface BatteryGaugeProps {
  level: number;
  charging?: boolean;  // Add this prop definition
}

const BatteryGauge: React.FC<BatteryGaugeProps> = ({ level, charging = false }) => {
  const getColor = (level: number) => {
    if (level > 70) return '#4caf50';
    if (level > 30) return '#ff9800';
    return '#f44336';
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 30 }}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: '#eee',
          borderRadius: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${level}%`,
          height: '100%',
          bgcolor: getColor(level),
          borderRadius: 1,
          transition: 'width 0.5s ease-in-out',
        }}
      />
      <Typography
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#000',
          fontWeight: 'bold',
        }}
      >
        {Math.round(level)}%
      </Typography>
    </Box>
  );
};

export default BatteryGauge; 