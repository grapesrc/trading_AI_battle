import React, { useState, useEffect } from 'react';
import { Typography, Container, Card, CardContent, CardActions, Button, Grid, Box, Paper } from '@mui/material';

// Sample data for contests
const ongoingContests = [
  { id: 1, title: '$KakuCoin / $BeginnerCoin (K/B) Trading', description: 'The V/P pair is known for its high volatility and sudden price spikes, making it ideal for scalping strategies. This contest challenges your bot to make quick profits from these rapid movements.', participants: 123, time: '10 days left', thumbnail: 'https://via.placeholder.com/300' },
  { id: 2, title: '$KakuCoin / $ChaosCoin (K/C) Trading', description: 'The S/L pair follows predictable long-term cycles based on celestial events. Develop a bot that can identify and trade these long-wave patterns for sustained gains.', participants: 87, time: '5 days left', thumbnail: 'https://via.placeholder.com/300' },
];

const newContests = [
];

const beginnerChallenges = [
    { id: 4, title: '入門チャレンジ1', description: '初心者向けの簡単なチャレンジです。', participants: 250, time: '無期限', thumbnail: 'https://via.placeholder.com/300' },
];

const ContestCard = ({ contest }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card>
        <img src={contest.thumbnail} alt={contest.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" color="text.primary">
          {contest.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {contest.description}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          参加者数: {contest.participants}人 | {contest.time}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href={`/contest/${contest.id}`} variant="contained" color="primary">参加する</Button>
        <Button size="small" href={`/rankings/${contest.id}`} variant="outlined" color="primary">ランキング</Button>
      </CardActions>
    </Card>
  </Grid>
);

function ContestList() {
  const [kakuCoin, setKakuCoin] = useState(0);

  useEffect(() => {
    // TODO: Fetch the actual KakuCoin balance from the backend
    setKakuCoin(1000); // Placeholder value
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container sx={{ py: 4 }}>
        <Paper sx={{ mb: 4, p: 2, textAlign: 'center', boxShadow: 3 }}>
          <Typography variant="h6" color="text.secondary">
            $KakuCoin Balance
          </Typography>
          <Typography variant="h4" color="primary" sx={{display:'inline-block'}}>
            {kakuCoin.toLocaleString()}
          </Typography>
            <Typography variant="h7" color="text.secondary" sx={{display:'inline-block',paddingLeft:'5px'}}>
            worth
          </Typography>
        </Paper>

        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          初心者向けチャレンジ
        </Typography>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {beginnerChallenges.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </Grid>

        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          Ongoing Contests
        </Typography>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {ongoingContests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </Grid>

        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          New Contests
        </Typography>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {newContests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default ContestList;