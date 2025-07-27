const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = 3001; // listenするport番号
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { WebSocketServer } = require('ws');

app.use(cors());

app.get('/test', (req, res) => {
    console.log(`Request URL: ${req.url}`);
    res.send("hello world");
});

app.get('/contests/:contest_id/story', (req, res) => {
    console.log(`Request URL: ${req.url}`);
    const contestId = req.params.contest_id;
    const filePath = path.join(__dirname, 'contensts', contestId, 'story.md');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(404).send('Not Found');
            return;
        }
        res.send(data);
    });
});

app.get('/contests/:contest_id/blockly_blocks', (req, res) => {
    console.log(`Request URL: ${req.url}`);
    const contestId = req.params.contest_id;
    const filePath = path.join(__dirname, 'contensts', contestId, 'blockly_blocks.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(404).send('Not Found');
            return;
        }
        res.send(data);
    });
});

app.get('/contests/:contest_id/blockly_setting', (req, res) => {
    console.log(`Request URL: ${req.url}`);
    const contestId = req.params.contest_id;
    const filePath = path.join(__dirname, 'contensts', contestId, 'blockly_setting.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(404).send('Not Found');
            return;
        }
        res.send(data);
    });
});

app.get('/contests/:id/chart', (req, res) => {
    const contestId = req.params.id;
    const interval = req.query.interval || '1m'; // Default to 1m if no interval is specified
    const filePath = path.join(__dirname, 'contensts', contestId, `simulation_data_${interval}.csv`);
    const results = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            res.json(results);
        });
});

const { exec } = require('child_process');

app.use(express.json());

app.post('/run_python', (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).send({ error: 'No code provided' });
    }

    // Pythonコードを一時ファイルに保存
    const tempFilePath = path.join(__dirname, 'temp_script.py');
    fs.writeFile(tempFilePath, code, (err) => {
        if (err) {
            return res.status(500).send({ error: 'Failed to write Python script' });
        }

        // Pythonスクリプトを実行
        exec(`python "${tempFilePath}"`, (error, stdout, stderr) => {
            // 一時ファイルを削除
            fs.unlink(tempFilePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Failed to delete temp script:', unlinkErr);
                }
            });

            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).send({ stdout, stderr });
            }
            res.send({ stdout, stderr });
        });
    });
});



app.get('/api/forex', async (req, res) => {
    try {
        const api_key = 'YOUR_ALPHA_VANTAGE_API_KEY'; // ここにAPIキーを入力してください
        const response = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=${api_key}`);
        const data = await response.json();
        if (data['Realtime Currency Exchange Rate']) {
            res.json({
                rate: data['Realtime Currency Exchange Rate']['5. Exchange Rate']
            });
        } else {
            res.status(500).json({ error: 'Failed to fetch forex data' });
        }
    } catch (error) {
        console.error('Error fetching forex data:', error);
        res.status(500).json({ error: 'Failed to fetch forex data' });
    }
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
  console.log('Client connected');

  const sendData = () => {
    const price = (Math.random() * 10 + 170).toFixed(2);
    const time = new Date().getSeconds().toString() + 's';
    ws.send(JSON.stringify({ time, price }));
  };

  const interval = setInterval(sendData, 1000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});
