
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Grid } from '@mui/material';

const rankings = [
  { rank: 1, user: 'AlphaExplorer', score: 15234, date: '2025/06/20 14:30' },
  { rank: 2, user: 'BetaOptimizer', score: 14987, date: '2025/06/21 10:15' },
  { rank: 3, user: 'GammaStrategist', score: 14801, date: '2025/06/21 18:00' },
];



function Rankings() {
  const { id } = useParams();
  const [rankedUsers, setRankedUsers] = useState([]);
  const [myUserId, setMyUserId] = useState(null);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    console.log('Fetched userId from sessionStorage:', userId); // Added log
    if (userId) {
      setMyUserId(userId);
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Contest: Resource Gathering Challenge - ランキング
        </Typography>
        {myUserId && (
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            あなたのユーザーID: {myUserId}
          </Typography>
        )}
        <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Button sx={{ borderRadius: '8px 8px 0 0', border: '1px solid #eee', borderBottom: 'none', backgroundColor: 'white', color: 'primary.main' }}>総合</Button>
        </Box>
        <TableContainer component={Paper} sx={{ mb: 4, border: '1px solid #eee' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>順位</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ユーザー</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>総資産 (KakuCoin)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankedUsers.map((user, index) => (
                <TableRow key={user.userId}>
                  <TableCell component="th" scope="row">{index + 1}</TableCell>
                  <TableCell>{user.userId}</TableCell>
                  <TableCell align="right">{user.score.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}

export default Rankings;
