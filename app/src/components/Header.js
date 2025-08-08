
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'text.primary', textDecoration: 'none' }}>
          Trade Battle
        </Typography>
        <Box>
          <Button component={Link} to="/" sx={{ color: 'text.secondary', '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}>
            Contests
          </Button>
          <Button component={Link} to="/rankings" sx={{ color: 'text.secondary', '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}>
            Rankings
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
