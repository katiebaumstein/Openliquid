const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const crawlerService = require('./services/crawlerService');
const aggregatorService = require('./services/aggregatorService');

let cachedLeaderboardData = {
  lastUpdated: null,
  data: {
    binance: [],
    okx: [],
    bybit: [],
    bitget: [],
    hyperliquid: [],
    aggregated: []
  }
};

cron.schedule('*/5 * * * *', async () => {
  console.log('Running scheduled crawler...');
  await updateLeaderboardData();
});

async function updateLeaderboardData() {
  try {
    console.log('Updating leaderboard data...');
    
    const [binanceData, okxData, bybitData, bitgetData, hyperliquidData] = await Promise.allSettled([
      crawlerService.crawlBinance(),
      crawlerService.crawlOKX(),
      crawlerService.crawlBybit(),
      crawlerService.crawlBitget(),
      crawlerService.crawlHyperliquid()
    ]);

    cachedLeaderboardData.data = {
      binance: binanceData.status === 'fulfilled' ? binanceData.value : [],
      okx: okxData.status === 'fulfilled' ? okxData.value : [],
      bybit: bybitData.status === 'fulfilled' ? bybitData.value : [],
      bitget: bitgetData.status === 'fulfilled' ? bitgetData.value : [],
      hyperliquid: hyperliquidData.status === 'fulfilled' ? hyperliquidData.value : []
    };

    cachedLeaderboardData.data.aggregated = aggregatorService.aggregateLeaderboards(cachedLeaderboardData.data);
    cachedLeaderboardData.lastUpdated = new Date();

    console.log('Leaderboard data updated successfully');
  } catch (error) {
    console.error('Error updating leaderboard data:', error);
  }
}

app.get('/api/leaderboard', (req, res) => {
  res.json({
    success: true,
    lastUpdated: cachedLeaderboardData.lastUpdated,
    data: cachedLeaderboardData.data
  });
});

app.get('/api/leaderboard/:exchange', (req, res) => {
  const { exchange } = req.params;
  
  if (!cachedLeaderboardData.data[exchange]) {
    return res.status(404).json({
      success: false,
      message: 'Exchange not found'
    });
  }

  res.json({
    success: true,
    lastUpdated: cachedLeaderboardData.lastUpdated,
    data: cachedLeaderboardData.data[exchange]
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Initial data fetch...');
  await updateLeaderboardData();
});

module.exports = app;