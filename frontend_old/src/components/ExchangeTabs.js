import React from 'react';

const ExchangeTabs = ({ selected, onSelect, exchanges }) => {
  const exchangeLabels = {
    aggregated: '🌍 All Exchanges',
    binance: '🟡 Binance',
    okx: '⚫ OKX',
    bybit: '🟠 Bybit',
    bitget: '🔵 Bitget',
    hyperliquid: '🟣 Hyperliquid'
  };

  return (
    <div className="exchange-tabs">
      {exchanges.map(exchange => (
        <button
          key={exchange}
          className={`tab ${selected === exchange ? 'active' : ''}`}
          onClick={() => onSelect(exchange)}
        >
          {exchangeLabels[exchange] || exchange}
        </button>
      ))}
    </div>
  );
};

export default ExchangeTabs;