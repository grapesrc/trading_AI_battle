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

const timeIntervals = {
  '1m': { unit: 'm', multiplier: 1, count: 60 },
  '10m': { unit: 'm', multiplier: 10, count: 10 },
  '1h': { unit: 'h', multiplier: 1, count: 6 },
};

const SimulationCanvas = () => {
  const simulationChartRef = useRef(null);
  const [simulationChartData, setSimulationChartData] = useState({ labels: [], datasets: [] });
  const [timeInterval, setTimeInterval] = useState('1m');

  // Simulation Chart Effect
  useEffect(() => {
    const chart = simulationChartRef.current;
    console.log('Chart instance:', chart);
    if (!chart) {
      return;
    }

    if (timeInterval === '1m') {
      const ws = new WebSocket('ws://localhost:3001');

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = event => {
        const newData = JSON.parse(event.data);

        setSimulationChartData(prevChartData => {
          const { labels, datasets } = prevChartData;

          const newLabels = [...labels, newData.time].slice(-60);
          const currentData = datasets.length > 0 ? datasets[0].data : [];
          const newPriceData = [...currentData, parseFloat(newData.price)].slice(-60);

          const newDatasets = datasets.length > 0 ? [
            {
              ...datasets[0],
              data: newPriceData,
            },
          ] : [
            {
              label: 'Stock Price',
              data: newPriceData,
              fill: true,
              backgroundColor: 'rgba(75, 192, 192, 0.4)',
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              pointRadius: 0,
            },
          ];

          return {
            labels: newLabels,
            datasets: newDatasets,
          };
        });
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };

      return () => {
        ws.close();
      };
    } else {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:3001/contests/1/chart?interval=${timeInterval}`);
          const data = await response.json();
          const labels = data.map(item => item.time);
          const dataPoints = data.map(item => parseFloat(item.price));

          const ctx = chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(75, 192, 192, 0.4)');
          gradient.addColorStop(1, 'rgba(75, 192, 192, 0)');

          setSimulationChartData({
            labels,
            datasets: [
              {
                label: 'Stock Price',
                data: dataPoints,
                fill: true,
                backgroundColor: gradient,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                pointRadius: 0,
              },
            ],
          });
          console.log('Updated simulationChartData (fetch):', { labels, datasets: [
            {
              label: 'Stock Price',
              data: dataPoints,
              fill: true,
              backgroundColor: gradient,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              pointRadius: 0,
            },
          ] });
        } catch (error) {
          console.error('Error fetching simulation data:', error);
        }
      };

      fetchData();
    }
  }, [timeInterval]);

  const simulationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Stock Price Simulation',
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Simulation Chart Section */}
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>シミュレーションチャート</Typography>
        <Box sx={{ mb: 2, alignSelf: 'center' }}>
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
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Line ref={simulationChartRef} data={simulationChartData} options={simulationOptions} />
        </Box>
      </Box>
    </Box>
  );
};

export default SimulationCanvas;