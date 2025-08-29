import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Grid, Paper, Typography, Button, Divider, ToggleButton, ToggleButtonGroup, TextField } from '@mui/material';
import BlocklyComponent from '../components/BlocklyComponent';
import SimulationCanvas from '../components/SimulationCanvas';
import OrderBook from '../components/OrderBook';
import Wallet from '../components/Wallet'; // Import Wallet component
import LessonModal from '../components/LessonModal'; // Import LessonModal component
import { toolbox_get } from '../blockly/toolbox';
import { defineStaticBlocks } from '../blockly/customBlocks';
import '../blockly/PythonGenerator.js';
import showdown from 'showdown';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';

// Define static blocks once
defineStaticBlocks();

function Contest() {
  const { id: paramId } = useParams();
  const location = useLocation();

  // Derive ID and lesson page status directly from the route for robustness
  const isLessonPage = location.pathname === '/contest/a';
  const id = isLessonPage ? 'a' : paramId;

  const [generatedCode, setGeneratedCode] = useState('');
  const [executionResult, setExecutionResult] = useState({ stdout: '', stderr: '' });
  const blocklyComponentRef = useRef(null);
  const [story, setStory] = useState('');
  const [toolbox, setToolbox] = useState(null);
  const [editorType, setEditorType] = useState('blockly');
  const [pythonCode, setPythonCode] = useState('');
  const [walletData, setWalletData] = useState(null); // State for wallet data
  const [executionTimeout, setExecutionTimeout] = useState(10000); // 10000 milliseconds default
  const [isLessonModalOpen, setLessonModalOpen] = useState(false);
  const [coinName, setCoinName] = useState('');

  useEffect(() => {
    const fetchCoinName = async () => {
      try {
        const response = await fetch(`http://localhost:3001/contests/${id}/coin`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCoinName(data.coinName);
      } catch (error) {
        console.error("Failed to fetch coin name:", error);
      }
    };

    if (id) {
      fetchCoinName();
    }
  }, [id]);

  const fetchWalletData = useCallback(async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:3001/wallets/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWalletData(data);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    }
  }, []);

  useEffect(() => {
    if (isLessonPage) {
      setLessonModalOpen(true);
    }
  }, [isLessonPage]);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (!userId || !id) return;

    const ws = new WebSocket(`ws://localhost:3001?userId=${userId}&contestId=${id}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'stdout') {
        setExecutionResult(prev => ({ ...prev, stdout: prev.stdout + message.data }));
      } else if (message.type === 'stderr') {
        setExecutionResult(prev => ({ ...prev, stderr: prev.stderr + message.data }));
      } else if (message.type === 'close') {
        console.log('Execution finished with code:', message.data.code);
      }
    };

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, [id]);

  useEffect(() => {
    const initializePage = async () => {
      const newToolbox = JSON.parse(JSON.stringify(toolbox_get));
      setToolbox(newToolbox);
      fetchWalletData(); // Fetch wallet data on initial load

      if (id) {
        const userId = sessionStorage.getItem('userId');
        // Set initial Python code with user_id and a sample program
        setPythonCode(`user_id = "${userId}"

# サンプルプログラム
# lessonCoin1の現在の価格を取得します
price = trade_api.get_price('lessonCoin1')

# もし価格が100 KakuCoinより安ければ1枚買い、
# 110 KakuCoinより高ければ1枚売ります。
if price < 100:
    # 1枚を99 KakuCoinで買い注文
    trade_api.buy('lessonCoin1', 99, 1)
    print("価格が" + str(price) + "なので、99 KakuCoinで1枚の買い注文を出しました。")
elif price > 110:
    # 1枚を111 KakuCoinで売り注文
    trade_api.sell('lessonCoin1', 111, 1)
    print("価格が" + str(price) + "なので、111 KakuCoinで1枚の売り注文を出しました。")
else:
    print("価格が" + str(price) + "なので、何もしません。")
`);
      }
    };

    initializePage();
  }, [id, fetchWalletData]);

  const handleEditorChange = (event, newEditorType) => {
    if (newEditorType !== null) {
      setEditorType(newEditorType);
    }
  };

  const handleRunSimulation = async () => {
    let userCode;
    if (editorType === 'blockly') {
      if (blocklyComponentRef.current) {
        userCode = blocklyComponentRef.current.getGeneratedCode();
        console.log('Generated Code:', userCode);
      }
    } else {
      userCode = pythonCode;
    }

    const userId = sessionStorage.getItem('userId');

    const finalCode = `import sys\nimport trade_api\ntrade_api.userId = sys.argv[1]\n\n${userCode}`;
    setGeneratedCode(finalCode);

    try {
      const response = await fetch('http://localhost:3001/run_python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, code: finalCode, userId, timeout: executionTimeout }),
      });

      const result = await response.json();
      setExecutionResult(result);
      if (!response.ok) {
        console.error('Python execution failed:', result.stderr);
      }
      
      console.log('Python execution result:', result);
      fetchWalletData(); // Re-fetch wallet data after execution
    } catch (error) {
      console.error('Failed to run Python code:', error);
      setExecutionResult({ stdout: '', stderr: error.message });
    }
  };

  const handleOpenStoryWindow = () => {
    const converter = new showdown.Converter();
    const html = converter.makeHtml(story);
    const newWindow = window.open('', '_blank', "popup");
    newWindow.document.write(html);
    newWindow.document.close();
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', bgcolor: 'background.default' }}>
      <Grid container sx={{ display: 'flex', height: '100%' }}>

        {/* Center: Blockly Workspace */}
        <Grid item sx={{ width: '55vw', height: '100%' }}>
          <ToggleButtonGroup
            value={editorType}
            exclusive
            onChange={handleEditorChange}
            aria-label="editor type"
          >
            <ToggleButton value="blockly" aria-label="blockly editor">
              Blockly
            </ToggleButton>
            <ToggleButton value="python" aria-label="python editor">
              Python
            </ToggleButton>
          </ToggleButtonGroup>
          {editorType === 'blockly' ? (
            toolbox && (
              <BlocklyComponent
                ref={blocklyComponentRef}
                toolbox={toolbox}
                contestId={id}
                workspaceConfiguration={{
                  renderer: 'geras',
                  grid: {
                    spacing: 25,
                    length: 3,
                    colour: '#A2D9EE',
                    snap: true,
                  },
                  zoom: {
                    controls: true,
                    wheel: true,
                    startScale: 0.9,
                    maxScale: 3,
                    minScale: 0.3,
                    scaleSpeed: 1.2,
                  },
                  media: 'https://blockly-demo.appspot.com/static/media/',
                  toolboxPosition: 'start',
                }}
              />
            )
          ) : (
            <Editor
              value={pythonCode}
              onValueChange={code => setPythonCode(code)}
              highlight={code => highlight(code, languages.python)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                height: 'calc(100% - 48px)',
              }}
            />
          )}
        </Grid>

        {/* Right Sidebar: Simulation and Analysis */}
        <Grid item xs={6} sx={{ width: '40vw', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{
            height: '100%',
            backgroundColor: 'transparent',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 0,
            borderLeft: '1px solid #4AA0DC'
          }}>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>

              <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>シミュレーション</Typography>
              <SimulationCanvas contestId={id} coinName={coinName} />
              <OrderBook contestId={id} />

              <Divider sx={{ my: 1 }} />

              <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>状況分析</Typography>
              <Box sx={{ color: 'text.primary', flexGrow: 1 }}>
                <Wallet walletData={walletData} />
                <Paper sx={{ p: 1, mt: 1, backgroundColor: executionResult.stderr ? '#FFD0D0' : 'background.paper' }} elevation={2}>
                  <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                    <b>Output:</b>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{executionResult.stdout}</pre>
                  </Typography>
                  {executionResult.stderr && (
                    <Typography variant="subtitle2" sx={{ color: 'error.main', mt: 1 }}>
                      <b>Error:</b>
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{executionResult.stderr}</pre>
                    </Typography>
                  )}
                </Paper>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <TextField
              label="実行時間制限 (ミリ秒)"
              type="number"
              value={executionTimeout}
              onChange={(e) => setExecutionTimeout(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 2, width: '100%' }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              {isLessonPage && (
                <Button variant="contained" onClick={() => setLessonModalOpen(true)} sx={{ flex: 1 }} color="info">レッスン</Button>
              )}
              <Button variant="contained" onClick={handleRunSimulation} sx={{ flex: 1 }} color="primary">▶︎ 実行</Button>
              <Button variant="outlined" sx={{ flex: 1 }} color="primary">リセット</Button>
              <Button variant="contained" sx={{ flex: 1 }} color="secondary">提出</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <LessonModal open={isLessonModalOpen} onClose={() => setLessonModalOpen(false)} lessonId={id} lessonHash={location.hash} />
    </Box>
  );
}

export default Contest;
