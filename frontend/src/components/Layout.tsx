import React from 'react';
import { Box, Container, AppBar, Toolbar, Typography } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Cart Management System
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 