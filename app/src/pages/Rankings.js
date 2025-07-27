
import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Grid, Card, CardContent } from '@mui/material';

const rankings = [
  { rank: 1, user: 'AlphaExplorer', score: 15234, date: '2025/06/20 14:30' },
  { rank: 2, user: 'BetaOptimizer', score: 14987, date: '2025/06/21 10:15' },
  { rank: 3, user: 'GammaStrategist', score: 14801, date: '2025/06/21 18:00' },
];

const hallOfFame = [
    { id: 1, user: 'CreativeCoder', score: 16000, title: '画期的な資源収集術', description: '特定の状況下で複数の資源を同時に収集するロジックを考案。' },
];

function Rankings() {
  const { id } = useParams();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          コンテスト名: 資源収集ロボットの効率化チャレンジ - ランキング
        </Typography>
        <Box sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Button>総合ランキング</Button>
            <Button>日別ランキング</Button>
            <Button>自分のロジック</Button>
        </Box>
        <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#A2D9EE' }}>
                <TableCell sx={{ color: 'text.primary' }}>順位</TableCell>
                <TableCell sx={{ color: 'text.primary' }}>ユーザー名</TableCell>
                <TableCell align="right" sx={{ color: 'text.primary' }}>スコア</TableCell>
                <TableCell align="right" sx={{ color: 'text.primary' }}>提出日時</TableCell>
                <TableCell align="center" sx={{ color: 'text.primary' }}>ロジックを見る</TableCell>
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
                    <Button variant="contained" size="small" color="secondary">見る</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h4" component="h2" gutterBottom color="text.primary">
          殿堂入りロジック
        </Typography>
        <Grid container spacing={4}>
          {hallOfFame.map((logic) => (
            <Grid item key={logic.id} xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div">{logic.title}</Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">考案者: {logic.user} | スコア: {logic.score}</Typography>
                        <Typography variant="body2">{logic.description}</Typography>
                        <Button size="small" sx={{ mt: 1 }}>ロジック詳細へ</Button>
                    </CardContent>
                </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Rankings;
