const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = 3001; // listenするport番号
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { WebSocketServer, WebSocket } = require('ws');

const coins = {
    BeginnerCoin: {
        price: 1,
        buyList: [],
        sellList: []
    },
    ChaosCoin: {
        price: 1,
        buyList: [],
        sellList: []
    },
    lessonCoin1: {
        price: 1,
        buyList: [],
        sellList: []
    },
};

app.use(cors());
app.use(express.json());

let wss;

const broadcast = (data) => {
    if (!wss) return;
    const jsonData = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(jsonData);
        }
    });
};



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

app.get('/contests/:id/price', (req, res) => {
    const contestId = req.params.id;
    const coinName = contestCoins[contestId] || contestCoins['default'];
    const coin = coins[coinName];

    if (!coin) {
        return res.status(404).send('Coin not found for this contest');
    }
    res.json({ price: coin.price });
});

app.post('/buy', (req, res) => {
    console.log('Buy request body:', req.body);
    const { coin, price, amount, userId } = req.body;
    if (!coins[coin]) {
        return res.status(400).send({ error: 'Invalid coin' });
    }

    let remainingAmount = amount;

    while (remainingAmount > 0) {
        coins[coin].sellList.sort((a, b) => a.price - b.price);
        const bestOffer = coins[coin].sellList[0];

        if (bestOffer && bestOffer.price <= price) {
            const tradeAmount = Math.min(remainingAmount, bestOffer.amount);
            coins[coin].price = bestOffer.price;
            bestOffer.amount -= tradeAmount;
            remainingAmount -= tradeAmount;

            if (bestOffer.amount === 0) {
                coins[coin].sellList.shift();
            }
        } else {
            coins[coin].buyList.push({ price, amount: remainingAmount, userId });
            coins[coin].buyList.sort((a, b) => b.price - a.price);
            remainingAmount = 0; // Exit loop
        }
    }

    res.send({ success: true, message: 'Trade executed or order placed' });

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.coinName === coin) {
            const updatedCoin = coins[coin];
            const orderBook = {
                type: 'orderBook',
                buyList: updatedCoin.buyList.map(o => ({ price: o.price, amount: o.amount })),
                sellList: updatedCoin.sellList.map(o => ({ price: o.price, amount: o.amount })),
                price: updatedCoin.price
            };
            client.send(JSON.stringify(orderBook));

            const priceData = {
                type: 'priceUpdate',
                price: updatedCoin.price,
                time: new Date().toLocaleTimeString()
            };
            client.send(JSON.stringify(priceData));
        }
    });
});

app.post('/sell', (req, res) => {
    console.log('Sell request body:', req.body);
    const { coin, price, amount, userId } = req.body;
    if (!coins[coin]) {
        return res.status(400).send({ error: 'Invalid coin' });
    }

    let remainingAmount = amount;

    while (remainingAmount > 0) {
        coins[coin].buyList.sort((a, b) => b.price - a.price);
        const bestOffer = coins[coin].buyList[0];

        if (bestOffer && bestOffer.price >= price) {
            const tradeAmount = Math.min(remainingAmount, bestOffer.amount);
            coins[coin].price = bestOffer.price;
            bestOffer.amount -= tradeAmount;
            remainingAmount -= tradeAmount;

            if (bestOffer.amount === 0) {
                coins[coin].buyList.shift();
            }
        } else {
            coins[coin].sellList.push({ price, amount: remainingAmount, userId });
            coins[coin].sellList.sort((a, b) => a.price - b.price);
            remainingAmount = 0; // Exit loop
        }
    }

    res.send({ success: true, message: 'Trade executed or order placed' });

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.coinName === coin) {
            const updatedCoin = coins[coin];
            const orderBook = {
                type: 'orderBook',
                buyList: updatedCoin.buyList.map(o => ({ price: o.price, amount: o.amount })),
                sellList: updatedCoin.sellList.map(o => ({ price: o.price, amount: o.amount })),
                price: updatedCoin.price
            };
            client.send(JSON.stringify(orderBook));

            const priceData = {
                type: 'priceUpdate',
                price: updatedCoin.price,
                time: new Date().toLocaleTimeString()
            };
            client.send(JSON.stringify(priceData));
        }
    });
});

const contestCoins = {
    '1': 'BeginnerCoin',
    'a': 'lessonCoin1',
    'lessonCoin1': 'lessonCoin1',
    'default': 'BeginnerCoin'
};

app.get('/contests/:id/chart', (req, res) => {
    const contestId = req.params.id;
    const coinName = contestCoins[contestId] || contestCoins['default'];
    const coin = coins[coinName];

    if (!coin) {
        return res.status(404).send('Coin not found for this contest');
    }

    const interval = req.query.interval || '1m';
    const chartContestId = contestId === 'a' ? '1' : contestId;
    const filePath = path.join(__dirname, 'contensts', chartContestId, `simulation_data_${interval}.csv`);
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Chart data not found');
    }

    const results = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const coinPrice = coin.price;
            const adjustedResults = results.map(item => ({
                ...item,
                price: parseFloat(item.price) * coinPrice
            }));
            res.json(adjustedResults);
        });
});

const { exec } = require('child_process');

app.post('/run_python', (req, res) => {
    const { code, userId } = req.body; // Get userId
    if (!code) {
        return res.status(400).send({ error: 'No code provided' });
    }

    const tempFilePath = path.join(__dirname, 'temp_script.py');
    fs.writeFile(tempFilePath, code, (err) => {
        if (err) {
            return res.status(500).send({ error: 'Failed to write Python script' });
        }

        exec(`python "${tempFilePath}" "${userId}"`, (error, stdout, stderr) => { // Pass userId as argument
            fs.unlink(tempFilePath, (unlinkErr) => {
                if (unlinkErr) console.error('Failed to delete temp script:', unlinkErr);
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
        const api_key = 'YOUR_ALPHA_VANTAGE_API_KEY';
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

wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const contestId = url.searchParams.get('contestId');
  const coinName = contestCoins[contestId] || contestCoins['default'];

  // Attach coinName to the ws connection object
  ws.coinName = coinName;

  console.log(`Client connected for contest ${contestId}, coin ${ws.coinName}`);

  const coin = coins[ws.coinName];
  if (coin) {
    // Send initial state
    const orderBook = {
      type: 'orderBook',
      buyList: coin.buyList.map(o => ({ price: o.price, amount: o.amount })),
      sellList: coin.sellList.map(o => ({ price: o.price, amount: o.amount })),
      price: coin.price
    };
    ws.send(JSON.stringify(orderBook));

    const priceData = {
        type: 'priceUpdate',
        price: coin.price,
        time: new Date().toLocaleTimeString()
    };
    ws.send(JSON.stringify(priceData));
  }

  ws.on('close', () => {
    console.log(`Client for ${ws.coinName} disconnected`);
  });
});

setInterval(() => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.coinName) {
            const coin = coins[client.coinName];
            if (coin) {
                const orderBook = {
                    type: 'orderBook',
                    buyList: coin.buyList.map(o => ({ price: o.price, amount: o.amount })),
                    sellList: coin.sellList.map(o => ({ price: o.price, amount: o.amount })),
                    price: coin.price
                };
                client.send(JSON.stringify(orderBook));

                const priceData = {
                    type: 'priceUpdate',
                    price: coin.price,
                    time: new Date().toLocaleTimeString()
                };
                client.send(JSON.stringify(priceData));
            }
        }
    });
}, 1000);