import React, { useState, useEffect } from 'react';
import { Typography, Container, Paper, Button, Box, Grid, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

// Sample data for contests
const ongoingContests = [
  { id: 1, title: '$BeginnerCoin / $KakuCoin Trading', description: '' },
  { id: 2, title: '$ChaosCoin / $KakuCoin Trading', description: '' },
];

const newContests = [];

const beginnerChallenges = [
    { id: 'a', hash: '1', title: 'レッスン1：最初の取引', description: '取引の基本を学ぶための初心者向けチャレンジ。' },
    { id: 'a', hash: '2', title: 'レッスン2：移動平均線を作ろう', description: '価格の履歴データ（リスト）と計算ブロックを使い、移動平均線を自分で計算して、戦略的に自動取引をします。' },
    { id: 'a', hash: '3', title: 'レッスン3：TensorFlowを使って値段予測をしよう', description: '機械学習ライブラリ「TensorFlow」を使い、過去の価格データから未来の価格を予測するAIを構築します。' },
];

const ContestListItem = ({ contest }) => (
    <Paper component={Link} to={`/contest/${contest.id}${contest.hash ? `#${contest.hash}` : ''}`} sx={{ 
        p: 2, 
        mb: 2, 
        display: 'flex', 
        alignItems: 'center', 
        textDecoration: 'none', 
        color: 'inherit',
        border: '1px solid #eee',
        '&:hover': { 
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
        }
    }}>
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                {contest.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {contest.description}
            </Typography>
            
        </Box>
        <Button variant="contained" color="primary" sx={{ ml: 2 }}>
            参加する
        </Button>
    </Paper>
);

function ContestList() {
  const [wallet, setWallet] = useState(null);
  const [prices, setPrices] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        // If no userId, create one. This logic is also in App.js but can be here as a fallback.
        const newUserId = Math.random().toString(36).substring(2);
        sessionStorage.setItem('userId', newUserId);
      }

      // Fetch wallet data
      try {
        const walletRes = await fetch(`http://localhost:3001/wallets/${sessionStorage.getItem('userId')}`);
        const walletData = await walletRes.json();
        setWallet(walletData);
      } catch (error) {
        console.error("Failed to fetch wallet:", error);
      }

      // Fetch prices
      try {
        const pricesRes = await fetch('http://localhost:3001/prices');
        const pricesData = await pricesRes.json();
        setPrices(pricesData);
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                マイウォレット
              </Typography>
              {wallet ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h5">KakuCoin:</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{wallet.KakuCoin.toLocaleString()}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  {Object.keys(wallet).filter(k => k !== 'KakuCoin').map(coin => (
                    <Box key={coin} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">{coin}:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{wallet[coin].toLocaleString()}</Typography>
                    </Box>
                  ))}
                </>
              ) : (
                <Typography>ウォレットを読み込んでいます...</Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                市場価格 (KakuCoin)
              </Typography>
              {prices ? (
                Object.entries(prices).map(([coin, price]) => (
                  <Box key={coin} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{coin}:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{price.toLocaleString()}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>価格を読み込んでいます...</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 400, mb: 3 }}>
          初心者向けチャレンジ
        </Typography>
        <Box sx={{ mb: 4 }}>
          {beginnerChallenges.map((contest) => (
            <ContestListItem key={contest.id} contest={contest} />
          ))}
        </Box>

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 400, mb: 3 }}>
          開催中のコンテスト
        </Typography>
        <Box sx={{ mb: 4 }}>
          {ongoingContests.map((contest) => (
            <ContestListItem key={contest.id} contest={contest} />
          ))}
        </Box>

        {newContests.length > 0 && (
            <>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    新しいコンテスト
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