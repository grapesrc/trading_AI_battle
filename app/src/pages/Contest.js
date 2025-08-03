import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Grid, Paper, Typography, Button, Divider, ToggleButton, ToggleButtonGroup } from '@mui/material';
import BlocklyComponent from '../components/BlocklyComponent';
import SimulationCanvas from '../components/SimulationCanvas';
import OrderBook from '../components/OrderBook';
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
  const [id, setId] = useState(paramId);
  const [generatedCode, setGeneratedCode] = useState('');
  const [executionResult, setExecutionResult] = useState({ stdout: '', stderr: '' });
  const blocklyComponentRef = useRef(null);
  const [story, setStory] = useState('');
  const [toolbox, setToolbox] = useState(null); // Initialize toolbox as null
  const [simulationCode, setSimulationCode] = useState('');
  const [editorType, setEditorType] = useState('blockly');
  const [pythonCode, setPythonCode] = useState('');

  useEffect(() => {
    if (location.pathname === '/contest/a') {
      setId('a');
    } else {
      setId(paramId);
    }
  }, [location, paramId]);

  useEffect(() => {
    const initializeBlockly = async () => {
                      const newToolbox = JSON.parse(JSON.stringify(toolbox_get));
                setToolbox(newToolbox);
        if (id) {
          /* 普通に要らない
            try {

                // 2. Fetch toolbox settings
                const res = await fetch(`http://localhost:3001/contests/${id}/blockly_setting`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();

                // 3. Update the toolbox state

                // Fetch story
                fetch(`http://localhost:3001/contests/${id}/story`)
                    .then(res => res.text())
                    .then(data => setStory(data))
                    .catch(err => console.error("Failed to fetch story:", err));

                // Fetch simulation code
                fetch(`http://localhost:3001/contests/${id}/simulation`)
                    .then(res => res.text())
                    .then(data => setSimulationCode(data))
                    .catch(err => console.error("Failed to fetch simulation code:", err));

                // Set initial Python code
                const coinName = id === 'a' ? 'lessonCoin1' : 'BeginnerCoin';
                setPythonCode(`# This is a Python editor.\n# You can write your code here.\n\nimport requests\nimport sys\n\n# Get user ID from command line arguments\nuserId = sys.argv[1]\n\ndef buy(coin, price, amount):\n    try:\n        response = requests.post('http://localhost:3001/buy', json={'coin': coin, 'price': price, 'amount': amount, 'userId': userId}, timeout=5)\n        print(f"Buy Order Response: {response.status_code} {response.text}")\n    except requests.exceptions.RequestException as e:\n        print(f"Buy Order Error: {e}")\n\ndef sell(coin, price, amount):\n    try:\n        response = requests.post('http://localhost:3001/sell', json={'coin': coin, 'price': price, 'amount': amount, 'userId': userId}, timeout=5)\n        print(f"Sell Order Response: {response.status_code} {response.text}")\n    except requests.exceptions.RequestException as e:\n        print(f"Sell Order Error: {e}")\n\n# Example usage:\n# buy('' + coinName + ''', 1, 10)\n# sell('' + coinName + ''', 1, 10)\n`);

            } catch (err) {
                console.error("Failed to initialize Blockly environment:", err);
            }
                */
        }
    };

    initializeBlockly();
  }, [id]);

  const handleEditorChange = (event, newEditorType) => {
    if (newEditorType !== null) {
      setEditorType(newEditorType);
    }
  };

  const handleRunSimulation = async () => {
    let code;
    if (editorType === 'blockly') {
      if (blocklyComponentRef.current) {
        code = blocklyComponentRef.current.getGeneratedCode();
      }
    } else {
      code = pythonCode;
    }
    setGeneratedCode(code);


    console.log(code)

    const userId = sessionStorage.getItem('userId'); // Get userId

    try {
      const response = await fetch('http://localhost:3001/run_python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, code, userId }), // Add userId to body
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await response.json();
      setExecutionResult(result);
      console.log('Execution result:', result);
    } catch (error) {
      console.error('Failed to run Python code:', error);
    }
  };

  const handleOpenStoryWindow = () => {
    const converter = new showdown.Converter();
    const html = converter.makeHtml(story);
    const newWindow = window.open('', '_blank',"popup");
    newWindow.document.write(html);
    newWindow.document.close();
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', bgcolor: 'background.default' }}>
      <Grid container sx={{display: 'flex', height: '100%' }}>

        {/* Center: Blockly Workspace */}
        <Grid item sx={{width:'55vw', height: '100%' }}>
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
        <Grid item xs={6} sx={{ width:'40vw',height: '100%', display: 'flex', flexDirection: 'column' }}>
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
              <SimulationCanvas contestId={id} />
              <OrderBook contestId={id} />
              
              <Divider sx={{ my: 1 }} />

              <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>状況分析</Typography>
              <Box sx={{ color: 'text.primary', flexGrow: 1 }}>
                  <Paper sx={{p: 1, mb: 1, bgcolor: 'background.paper'}} elevation={2}>
                      <Typography variant="subtitle2">スコア: 12,345 / 最高: 15,000</Typography>
                  </Paper>
                  <Paper sx={{p: 1, backgroundColor: executionResult.stderr ? '#FFD0D0' : 'background.paper'}} elevation={2}>
                      <Typography variant="subtitle2" sx={{color: executionResult.stderr ? 'error.main' : 'text.primary'}}>
                          {executionResult.stderr || executionResult.stdout}
                      </Typography>
                  </Paper>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Button variant="contained" onClick={handleRunSimulation} sx={{ flex: 1 }} color="primary">▶︎ 実行</Button>
              <Button variant="outlined" sx={{ flex: 1 }} color="primary">リセット</Button>
              <Button variant="contained" sx={{ flex: 1 }} color="secondary">提出</Button>
            </Box>
          </Paper>
          </Grid>
      </Grid>
    </Box>
  );
}

export default Contest;
