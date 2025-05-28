const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const crawlerService = require('./services/crawlerService');
const aggregatorService = require('./services/aggregatorService');
const mockDataService = require('./services/mockDataService');

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

    // Log OKX data for debugging
    if (okxData.status === 'fulfilled' && okxData.value.length > 0) {
      console.log(`✅ OKX: Fetched ${okxData.value.length} traders`);
    }

    cachedLeaderboardData.data = {
      binance: binanceData.status === 'fulfilled' && binanceData.value.length > 0 ? binanceData.value : mockDataService.getMockDataByExchange('binance'),
      okx: okxData.status === 'fulfilled' && okxData.value.length > 0 ? okxData.value : mockDataService.getMockDataByExchange('okx'),
      bybit: bybitData.status === 'fulfilled' && bybitData.value.length > 0 ? bybitData.value : mockDataService.getMockDataByExchange('bybit'),
      bitget: bitgetData.status === 'fulfilled' && bitgetData.value.length > 0 ? bitgetData.value : mockDataService.getMockDataByExchange('bitget'),
      hyperliquid: hyperliquidData.status === 'fulfilled' && hyperliquidData.value.length > 0 ? hyperliquidData.value : mockDataService.getMockDataByExchange('hyperliquid')
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