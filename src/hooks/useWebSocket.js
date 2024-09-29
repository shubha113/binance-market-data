import { useEffect, useState } from 'react';

const useWebSocket = (symbol, interval) => {
  const [data, setData] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const newWs = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`);

      newWs.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const kline = message.k;

        if (kline && kline.x) {
          const newCandle = {
            time: Math.floor(kline.t / 1000),
            open: parseFloat(kline.o),
            high: parseFloat(kline.h),
            low: parseFloat(kline.l),
            close: parseFloat(kline.c),
          };

          // to update the data state with new candle
          setData((prevData) => {
            const updatedData = [...prevData, newCandle].slice(-100); // this will keep only last 100 candles
            return updatedData;
          });
        }
      };

      newWs.onclose = (event) => {
        if (event.code !== 1000) {
          setTimeout(connectWebSocket, 1000); // Attempt to reconnect after 1 second
        }
      };

      setWs(newWs);
    };

    connectWebSocket(); // Connect to WebSocket

    return () => {
      if (ws) {
        ws.close(1000); // Close the connection cleanly when component unmounts
      }
    };
  }, [symbol, interval]); // Reconnect if symbol or interval changes

  return data;
};

export default useWebSocket;
