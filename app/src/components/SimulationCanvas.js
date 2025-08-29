import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const timeIntervals = { '1m': {}, '10m': {}, '1h': {} };

const baseDatasetOptions = {
  label: 'Price',
  fill: true,
  backgroundColor: 'rgba(75, 192, 192, 0.4)',
  borderColor: 'rgb(75, 192, 192)',
  tension: 0.1,
  pointRadius: 0,
};

const maDatasetOptions = (label, color) => ({
  label,
  fill: false,
  borderColor: color,
  tension: 0.1,
  pointRadius: 0,
});

const calculateCMA = (data) => {
  if (!data || data.length === 0) {
    return [];
  }
  const cma = [];
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
    cma.push(sum / (i + 1));
  }
  return cma;
};


const SimulationCanvas = ({ contestId, coinName }) => {
  const simulationChartRef = useRef(null);
  const [timeInterval, setTimeInterval] = useState('1m');

  const [data1m, setData1m] = useState({ labels: [], datasets: [{ ...baseDatasetOptions, data: [] }] });
  const [data10m, setData10m] = useState({ labels: [], datasets: [{ ...baseDatasetOptions, data: [] }] });
  const [data1h, setData1h] = useState({ labels: [], datasets: [{ ...baseDatasetOptions, data: [] }] });

  const [showMA, setShowMA] = useState(false);

  const latestPriceRef = useRef(null);

  // Effect 1: WebSocket connection to get live price
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3001?contestId=${contestId}`);
    ws.onopen = () => console.log('WebSocket connected');
    ws.onmessage = event => {
      const newData = JSON.parse(event.data);
      if (newData.type !== 'priceUpdate') return;
      
      const newPoint = { time: newData.time, price: parseFloat(newData.price) };
      latestPriceRef.current = newPoint;

      // Update 1m data immediately
      setData1m(prev => {
        const newLabels = [...prev.labels, newPoint.time].slice(-60);
        const newPriceData = [...prev.datasets[0].data, newPoint.price].slice(-60);
        
        const datasets = [
          { ...prev.datasets[0], data: newPriceData },
        ];

        return { labels: newLabels, datasets };
      });
    };
    ws.onclose = () => console.log('WebSocket disconnected');
    return () => ws.close();
  }, [contestId]);

  // Effect 2: Timers to update 10m and 1h data
  useEffect(() => {
    const updateData = (setter, history) => {
      if (latestPriceRef.current) {
        const newPoint = latestPriceRef.current;
        setter(prev => ({
          labels: [...prev.labels, newPoint.time].slice(-history),
          datasets: [{ ...prev.datasets[0], data: [...prev.datasets[0].data, newPoint.price].slice(-history) }],
        }));
      }
    };

    const interval10m = setInterval(() => updateData(setData10m, 60), 30000);
    const interval1h = setInterval(() => updateData(setData1h, 60), 60000);

    return () => {
      clearInterval(interval10m);
      clearInterval(interval1h);
    };
  }, []);

  const getDataForInterval = () => {
    let data;
    switch (timeInterval) {
      case '1m': data = data1m; break;
      case '10m': data = data10m; break;
      case '1h': data = data1h; break;
      default: return { labels: [], datasets: [] };
    }

    const chartData = { ...data, datasets: [...data.datasets] };

    if (showMA) {
      const cma = calculateCMA(data.datasets[0].data);
      chartData.datasets.push({ ...maDatasetOptions('Moving Average', 'orange'), data: cma });
    }

    return chartData;
  };

  const simulationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: `${coinName} price chart: (${timeInterval})`,
        font: { size: 18 },
      },
    },
    scales: {
      x: { display: false, grid: { display: false } },
      y: { grid: { color: 'rgba(200, 200, 200, 0.2)' }, beginAtZero: false },
    },
  };

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>シミュレーションチャート</Typography>
        <Box sx={{ mb: 2, alignSelf: 'center', display: 'flex', gap: 2 }}>
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            {Object.keys(timeIntervals).map((interval) => (
              <Button
                key={interval}
                variant={timeInterval === interval ? 'contained' : 'outlined'}
                onClick={() => setTimeInterval(interval)}
              >
                {interval}
              </Button>
            ))}
          </ButtonGroup>
          <ButtonGroup variant="outlined" aria-label="ma toggles">
            <Button
              variant={showMA ? 'contained' : 'outlined'}
              onClick={() => setShowMA(p => !p)}
            >
              移動平均線
            </Button>
          </ButtonGroup>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Line ref={simulationChartRef} data={getDataForInterval()} options={simulationOptions} />
        </Box>
      </Box>
    </Box>
  );
};

export default SimulationCanvas;
