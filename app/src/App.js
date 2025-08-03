import React, { useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { muiTheme } from './theme'; // Import muiTheme
import Header from './components/Header';
import ContestList from './pages/ContestList';
import Contest from './pages/Contest';
import Rankings from './pages/Rankings';

function App() {
  useEffect(() => {
    if (!sessionStorage.getItem('userId')) {
      const userId = Math.random().toString(36).substring(2);
      sessionStorage.setItem('userId', userId);
    }
  }, []);

  return (
    <ThemeProvider theme={muiTheme}> {/* Use muiTheme */}
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<ContestList />} />
          <Route path="/contest/a" element={<Contest />} />
          <Route path="/contest/:id" element={<Contest />} />
          <Route path="/rankings" element={<Rankings />} />
          {/* TODO: Implement these pages */}
          <Route path="/mypage" element={<ContestList />} />
          <Route path="/help" element={<ContestList />} />
          <Route path="/notifications" element={<ContestList />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;