
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#A2D9EE' }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'text.primary', textDecoration: 'none' }}>
          Trading bot battles
        </Typography>
        <Button color="inherit" component={Link} to="/" sx={{ color: 'text.primary' }}>
          コンテスト一覧
        </Button>
        <Button color="inherit" component={Link} to="/mypage" sx={{ color: 'text.primary' }}>
          マイページ
        </Button>
        <Button color="inherit" component={Link} to="/rankings" sx={{ color: 'text.primary' }}>
          ランキング
        </Button>
        <Button color="inherit" component={Link} to="/help" sx={{ color: 'text.primary' }}>
          ヘルプ
        </Button>
        <Button color="inherit" component={Link} to="/notifications" sx={{ color: 'text.primary' }}>
          お知らせ
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
