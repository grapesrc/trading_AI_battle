import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';

function Wallet({ walletData }) {
  if (!walletData) {
    return (
      <Paper sx={{ p: 1, mb: 1, bgcolor: 'background.paper' }} elevation={2}>
        <Typography variant="subtitle2">Loading Wallet...</Typography>
      </Paper>
    );
  }

  // Define the order of coins
  const coinOrder = ['BeginnerCoin', 'ChaosCoin', 'lessonCoin1'];

  return (
    <Paper sx={{ p: 1, mb: 1, bgcolor: 'background.paper' }} elevation={2}>
      <Typography variant="h6" sx={{ mb: 1 }}>My Wallet</Typography>
      
      {coinOrder.map(coinName => {
        if (walletData[coinName] !== undefined) {
          return (
            <Box key={coinName} sx={{ mb: 0.5 }}>
              <Typography variant="body2" component="div">
                {coinName}: {walletData[coinName].toLocaleString()}
              </Typography>
            </Box>
          );
        }
        return null;
      })}
    </Paper>
  );
}

export default Wallet;