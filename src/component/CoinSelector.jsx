import React from 'react';

const CoinSelector = ({ coins, selectedCoin, onSelect }) => {
  return (
    <select value={selectedCoin} onChange={e => onSelect(e.target.value)}>
      {coins.map(coin => (
        <option key={coin} value={coin}>
              {coin}
        </option>
      ))}
    </select>
  );
};

export default CoinSelector;
