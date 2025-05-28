const generateMockTrader = (index, exchange) => {
  const names = [
    'CryptoWhale', 'DeFiMaster', '2T1Q...ezZQ', 'KindGod', '橙橙怪QVQ',
    'TradingKing', '炒B的麦妾', '十年炒币', '交易员三木', '安东尼水',
    'July', '北向的杰克', '_forsake_', '十六夜', '小嘴滴仙',
    'BlockchainPro', 'FuturesGuru', 'MoonTrader', 'ProfitHunter', 'AlphaSeeker'
  ];
  
  const randomName = names[Math.floor(Math.random() * names.length)] + '_' + Math.floor(Math.random() * 1000);
  const roi = (Math.random() * 500 - 100).toFixed(2);
  const pnl = Math.random() * 1000000 - 200000;
  const winRate = Math.random() * 100;
  
  return {
    id: `${exchange}_${index}`,
    nickname: randomName,
    userId: `${exchange}_user_${Math.random().toString(36).substring(7)}`,
    roi: parseFloat(roi),
    pnl: pnl,
    winRate: winRate,
    rank: index + 1,
    exchange: exchange,
    timestamp: new Date(),
    followers: Math.floor(Math.random() * 10000),
    totalTrades: Math.floor(Math.random() * 5000),
    avgProfit: Math.random() * 1000,
    maxDrawdown: Math.random() * 30,
    sharpeRatio: (Math.random() * 3).toFixed(2),
    daysSinceStart: Math.floor(Math.random() * 365)
  };
};

const generateExchangeData = (exchange, count = 50) => {
  return Array.from({ length: count }, (_, i) => generateMockTrader(i, exchange));
};

const getAllMockData = () => {
  const exchanges = ['binance', 'okx', 'bybit', 'bitget', 'hyperliquid'];
  const allData = [];
  
  exchanges.forEach(exchange => {
    const traders = generateExchangeData(exchange, 20);
    allData.push(...traders);
  });
  
  // Sort by ROI for global ranking
  allData.sort((a, b) => b.roi - a.roi);
  
  // Update global ranks
  allData.forEach((trader, index) => {
    trader.globalRank = index + 1;
  });
  
  return allData;
};

const getMockDataByExchange = (exchange) => {
  if (!exchange) return getAllMockData();
  return generateExchangeData(exchange, 50);
};

module.exports = {
  getAllMockData,
  getMockDataByExchange
};