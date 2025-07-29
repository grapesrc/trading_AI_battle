import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Paper, Typography, Button, Divider } from '@mui/material';
import BlocklyComponent from '../components/BlocklyComponent';
import SimulationCanvas from '../components/SimulationCanvas';
import OrderBook from '../components/OrderBook';
import { toolbox_get } from '../blockly/toolbox';
import { defineStaticBlocks } from '../blockly/customBlocks';
import '../blockly/PythonGenerator.js';
import showdown from 'showdown';



// Define static blocks once
defineStaticBlocks();

function Contest() {
  const { id } = useParams();
  const [generatedCode, setGeneratedCode] = useState('');
  const [executionResult, setExecutionResult] = useState({ stdout: '', stderr: '' });
  const blocklyComponentRef = useRef(null);
  const [story, setStory] = useState('');
  const [toolbox, setToolbox] = useState(null); // Initialize toolbox as null
  const [simulationCode, setSimulationCode] = useState('');

  useEffect(() => {
    const initializeBlockly = async () => {
        if (id) {
            try {

                // 2. Fetch toolbox settings
                const res = await fetch(`http://localhost:3001/contests/${id}/blockly_setting`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();

                // 3. Update the toolbox state
                const newToolbox = JSON.parse(JSON.stringify(toolbox_get));
                newToolbox.contents[0].contents = data.setting;
                setToolbox(newToolbox);

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

            } catch (err) {
                console.error("Failed to initialize Blockly environment:", err);
            }
        }
    };

    initializeBlockly();
  }, [id]);

  const handleRunSimulation = async () => {
    if (blocklyComponentRef.current) {
      const code = blocklyComponentRef.current.getGeneratedCode();
      setGeneratedCode(code);

      console.log(code)

      try {
        const response = await fetch('http://localhost:3001/run_python', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, code }),
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
          {toolbox && (
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
              <SimulationCanvas />
              <OrderBook />
              
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