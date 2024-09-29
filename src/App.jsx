import React, { useState, useEffect } from 'react';
import useWebSocket from './hooks/useWebSocket';
import CandlestickChart from './component/Chart';
import CoinSelector from './component/CoinSelector';
import './App.css';

const App = () => {
  const coins = ['ethusdt', 'bnbusdt', 'dotusdt'];
  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [interval, setInterval] = useState('1m');
  const [chartData, setChartData] = useState([]);

  // Fetch WebSocket data
  const data = useWebSocket(selectedCoin, interval);

  useEffect(() => {
    // When new data arrives from WebSocket, update chartData
    if (data.length > 0) {
      setChartData(data); // Update chart data with live data
      localStorage.setItem(selectedCoin, JSON.stringify(data));
    }
  }, [data, selectedCoin]);

  const handleCoinChange = (coin) => {
    // Clear chart data before switching to prevent mixing data from different coins
    setChartData([]); 
    setSelectedCoin(coin);

    // Check if there's existing data in localStorage for the selected coin
    const savedData = localStorage.getItem(coin);
    if (savedData) {
      setChartData(JSON.parse(savedData));
    }
  };

  return (
    <div className="app-container">
      <h1>Binance Market Data</h1>
      
        <label htmlFor="coin-selector">Select Coin:</label>
        <CoinSelector 
          coins={coins} 
          selectedCoin={selectedCoin} 
          onSelect={handleCoinChange} 
          id="coin-selector"
        />
        
        <label htmlFor="interval-selector">
          Interval:
          <select 
            id="interval-selector"
            value={interval} 
            onChange={e => setInterval(e.target.value)}
          >
            <option value="1m">1 Minute</option>
            <option value="3m">3 Minutes</option>
            <option value="5m">5 Minutes</option>
          </select>
        </label>
      
      <div className="chart-container">
        <CandlestickChart data={chartData} />
      </div>
    </div>
  );
};

export default App;
