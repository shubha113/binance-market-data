import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const CandlestickChart = ({ data }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);

  useEffect(() => {
    // Destroy the previous chart instance when the data changes to prevent mixing data from different coins
    if (chartRef.current) {
      chartRef.current.remove(); 
      chartRef.current = null;
    }

    // Create a new chart instance
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.offsetWidth,
      height: chartContainerRef.current.offsetHeight,
      layout: {
        backgroundColor: 'transparent',
        textColor: '#000000',
      },
      priceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        autoScale: false, 
        borderColor: '#cccccc',
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#4caf50',
      downColor: '#f44336',
      borderDownColor: '#f44336',
      borderUpColor: '#4caf50',
      wickDownColor: '#f44336',
      wickUpColor: '#4caf50',
    });

    // Ensure valid data with correct timestamp handling
    const validData = data
      .filter(item => item.time && !isNaN(item.time) && item.time > 0)
      .map(item => ({
        time: item.time * 1000,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

    const sortedData = validData.sort((a, b) => a.time - b.time);
    const uniqueData = sortedData.filter((item, index, self) =>
      index === self.findIndex(t => t.time === item.time)
    );

    // Update price range
    const priceMin = Math.min(...uniqueData.map(item => item.low)) || 0;
    const priceMax = Math.max(...uniqueData.map(item => item.high)) * 1.1;

    // Update price scale
    chartRef.current.applyOptions({
      priceScale: {
        autoScale: false,
        minValue: priceMin,
        maxValue: priceMax,
      },
    });

    // Set the new data on the chart
    candlestickSeriesRef.current.setData(uniqueData);

    const handleResize = () => {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.offsetWidth,
        height: chartContainerRef.current.offsetHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: '100%',
        height: '70vh',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    />
  );
};

export default CandlestickChart;
