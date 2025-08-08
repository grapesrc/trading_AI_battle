
import React, { useState, useEffect } from 'react';
import { Typography, Container, Paper, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

// Sample data for contests
const ongoingContests = [
  { id: 1, title: '$KakuCoin / $BeginnerCoin (K/B) Trading', description: 'The V/P pair is known for its high volatility and sudden price spikes, making it ideal for scalping strategies. This contest challenges your bot to make quick profits from these rapid movements.', participants: 123, time: '10 days left' },
  { id: 2, title: '$KakuCoin / $ChaosCoin (K/C) Trading', description: 'The S/L pair follows predictable long-term cycles based on celestial events. Develop a bot that can identify and trade these long-wave patterns for sustained gains.', participants: 87, time: '5 days left' },
];

const newContests = [];

const beginnerChallenges = [
    { id: 'a', title: '入門チャレンジ1', description: '初心者向けの簡単なチャレンジです。', participants: 250, time: '無期限' },
];

const ContestListItem = ({ contest }) => (
    <Paper component={Link} to={`/contest/${contest.id}`} sx={{ 
        p: 2, 
        mb: 2, 
        display: 'flex', 
        alignItems: 'center', 
        textDecoration: 'none', 
        color: 'inherit',
        border: '1px solid #eee',
        '&:hover': { 
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.04)' // Changed to light gray
        }
    }}>
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                {contest.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {contest.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Participants: {contest.participants} | {contest.time}
            </Typography>
        </Box>
        <Button variant="contained" color="primary" sx={{ ml: 2 }}>
            View
        </Button>
    </Paper>
);

function ContestList() {
  const [kakuCoin, setKakuCoin] = useState(0);

  useEffect(() => {
    // TODO: Fetch the actual KakuCoin balance from the backend
    setKakuCoin(1000); // Placeholder value
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ mb: 4, p: 3, textAlign: 'center', border: '1px solid #eee' }}>
          <Typography variant="h6" color="text.secondary">
            $KakuCoin Balance
          </Typography>
          <Typography variant="h4" color="primary" sx={{display:'inline-block', fontWeight: 'bold'}}>
            {kakuCoin.toLocaleString()}
          </Typography>
        </Paper>

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 400, mb: 3 }}>
          Beginner Challenges
        </Typography>
        <Box sx={{ mb: 4 }}>
          {beginnerChallenges.map((contest) => (
            <ContestListItem key={contest.id} contest={contest} />
          ))}
        </Box>

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 400, mb: 3 }}>
          Ongoing Contests
        </Typography>
        <Box sx={{ mb: 4 }}>
          {ongoingContests.map((contest) => (
            <ContestListItem key={contest.id} contest={contest} />
          ))}
        </Box>

        {newContests.length > 0 && (
            <>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    New Contests
                </Typography>
                <Box sx={{ mb: 4 }}>
                {newContests.map((contest) => (
                    <ContestListItem key={contest.id} contest={contest} />
                ))}
                </Box>
            </>
        )}
      </Container>
    </Box>
  );
}

export default ContestList;
