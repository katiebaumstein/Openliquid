const aggregateLeaderboards = (exchangeData) => {
  const allTraders = [];
  
  Object.entries(exchangeData).forEach(([exchange, traders]) => {
    if (exchange !== 'aggregated' && Array.isArray(traders)) {
      allTraders.push(...traders);
    }
  });

  const aggregated = allTraders
    .filter(trader => trader && trader.roi !== undefined)
    .sort((a, b) => {
      const roiA = parseFloat(a.roi) || 0;
      const roiB = parseFloat(b.roi) || 0;
      return roiB - roiA;
    })
    .map((trader, index) => ({
      ...trader,
      globalRank: index + 1
    }));

  return aggregated;
};

const getTopTradersByMetric = (traders, metric, limit = 10) => {
  return [...traders]
    .sort((a, b) => {
      const valueA = parseFloat(a[metric]) || 0;
      const valueB = parseFloat(b[metric]) || 0;
      return valueB - valueA;
    })
    .slice(0, limit);
};

const calculateStats = (traders) => {
  if (!traders || traders.length === 0) {
    return {
      totalTraders: 0,
      averageROI: 0,
      averagePNL: 0,
      averageWinRate: 0
    };
  }

  const stats = traders.reduce((acc, trader) => {
    acc.totalROI += parseFloat(trader.roi) || 0;
    acc.totalPNL += parseFloat(trader.pnl) || 0;
    acc.totalWinRate += parseFloat(trader.winRate) || 0;
    return acc;
  }, { totalROI: 0, totalPNL: 0, totalWinRate: 0 });

  return {
    totalTraders: traders.length,
    averageROI: (stats.totalROI / traders.length).toFixed(2),
    averagePNL: (stats.totalPNL / traders.length).toFixed(2),
    averageWinRate: (stats.totalWinRate / traders.length).toFixed(2)
  };
};

module.exports = {
  aggregateLeaderboards,
  getTopTradersByMetric,
  calculateStats
};