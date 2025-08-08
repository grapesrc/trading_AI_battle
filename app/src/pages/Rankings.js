
import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Grid } from '@mui/material';

const rankings = [
  { rank: 1, user: 'AlphaExplorer', score: 15234, date: '2025/06/20 14:30' },
  { rank: 2, user: 'BetaOptimizer', score: 14987, date: '2025/06/21 10:15' },
  { rank: 3, user: 'GammaStrategist', score: 14801, date: '2025/06/21 18:00' },
];

const hallOfFame = [
    { id: 1, user: 'CreativeCoder', score: 16000, title: 'Innovative Resource Gathering', description: 'Devised a logic to gather multiple resources simultaneously under specific conditions.' },
];

function Rankings() {
  const { id } = useParams();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Contest: Resource Gathering Challenge - Rankings
        </Typography>
        <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Button sx={{ borderRadius: '8px 8px 0 0', border: '1px solid #eee', borderBottom: 'none', backgroundColor: 'white', color: 'primary.main' }}>Overall</Button>
            <Button sx={{ color: 'text.secondary' }}>Daily</Button>
            <Button sx={{ color: 'text.secondary' }}>My Logic</Button>
        </Box>
        <TableContainer component={Paper} sx={{ mb: 4, border: '1px solid #eee' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Score</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>View Logic</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankings.map((row) => (
                <TableRow key={row.rank}>
                  <TableCell component="th" scope="row">{row.rank}</TableCell>
                  <TableCell>{row.user}</TableCell>
                  <TableCell align="right">{row.score}</TableCell>
                  <TableCell align="right">{row.date}</TableCell>
                  <TableCell align="center">
                    <Button variant="outlined" size="small">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Hall of Fame
        </Typography>
        <Grid container spacing={2}>
          {hallOfFame.map((logic) => (
            <Grid item key={logic.id} xs={12} md={6}>
                <Paper sx={{ p: 2, border: '1px solid #eee' }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>{logic.title}</Typography>
                    <Typography sx={{ mb: 1.5, mt: 0.5 }} color="text.secondary">By: {logic.user} | Score: {logic.score}</Typography>
                    <Typography variant="body2">{logic.description}</Typography>
                    <Button size="small" sx={{ mt: 1, p: 0 }}>View Logic Details</Button>
                </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Rankings;
