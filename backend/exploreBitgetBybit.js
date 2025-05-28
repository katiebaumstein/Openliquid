const axios = require('axios');

const browserHeaders = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9'
};

// Explore Bybit endpoints
const exploreBybit = async () => {
  console.log('\n=== Exploring Bybit APIs ===');
  
  const endpoints = [
    // V3 APIs
    'https://api.bybit.com/v5/market/leaderboard',
    'https://api.bybit.com/v5/public/copytrade/leader-list',
    'https://api.bybit.com/copytrade/api/v1/public/master/list',
    'https://api.bybit.com/fapi/beehive/public/v1/common/copy-trade/leader-list',
    'https://api.bybit.com/copy-trading/api/v1/public/masters',
    
    // Alternative domains
    'https://api-testnet.bybit.com/v5/market/leaderboard',
    'https://api.bytick.com/v5/market/leaderboard'
  ];

  for (const url of endpoints) {
    try {
      console.log(`\nTrying: ${url}`);
      const response = await axios.get(url, {
        headers: {
          ...browserHeaders,
          'Origin': 'https://www.bybit.com',
          'Referer': 'https://www.bybit.com'
        },
        timeout: 5000
      });
      console.log('✅ Success!');
      console.log('Response:', JSON.stringify(response.data).substring(0, 300));
      return;
    } catch (error) {
      console.log(`❌ Failed: ${error.response?.status || error.message}`);
    }
  }
};

// Explore Bitget endpoints
const exploreBitget = async () => {
  console.log('\n=== Exploring Bitget APIs ===');
  
  const endpoints = [
    // V1 APIs
    'https://api.bitget.com/api/mix/v1/trace/leaderboardList',
    'https://api.bitget.com/api/copy/v1/spot_trader/total_list',
    'https://api.bitget.com/api/copy/v1/mix_trader/total_list',
    'https://api.bitget.com/api/copy/v1/public/elite_traders',
    
    // V2 APIs
    'https://api.bitget.com/api/v2/copytrade/public/trader-list',
    'https://api.bitget.com/api/v2/copy-trade/public/trader-ranks',
    'https://api.bitget.com/api/v2/public/copytrade/elite-traders',
    
    // Web APIs
    'https://www.bitget.com/v1/copy/mix/public/tradersRank',
    'https://www.bitget.com/api/web/v1/public/copy-trade/traders'
  ];

  for (const url of endpoints) {
    try {
      console.log(`\nTrying: ${url}`);
      const response = await axios.get(url, {
        headers: {
          ...browserHeaders,
          'Origin': 'https://www.bitget.com',
          'Referer': 'https://www.bitget.com/copy-trading/leaderboard'
        },
        timeout: 5000
      });
      console.log('✅ Success!');
      console.log('Response:', JSON.stringify(response.data).substring(0, 300));
      return;
    } catch (error) {
      console.log(`❌ Failed: ${error.response?.status || error.message}`);
      if (error.response?.data) {
        console.log('Error data:', JSON.stringify(error.response.data).substring(0, 100));
      }
    }
  }
};

// Try different approaches for Bybit
const tryBybitWithPost = async () => {
  console.log('\n=== Trying Bybit with POST requests ===');
  
  const endpoints = [
    {
      url: 'https://api.bybit.com/fapi/beehive/public/v1/common/copy-trade/leader-list',
      data: { page: 1, pageSize: 20 }
    },
    {
      url: 'https://api.bybit.com/copytrade/api/v1/public/master/list',
      data: { limit: 20, offset: 0 }
    }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\nTrying POST: ${endpoint.url}`);
      const response = await axios.post(endpoint.url, endpoint.data, {
        headers: {
          ...browserHeaders,
          'Content-Type': 'application/json',
          'Origin': 'https://www.bybit.com',
          'Referer': 'https://www.bybit.com'
        },
        timeout: 5000
      });
      console.log('✅ Success!');
      console.log('Response:', JSON.stringify(response.data).substring(0, 300));
      return;
    } catch (error) {
      console.log(`❌ Failed: ${error.response?.status || error.message}`);
    }
  }
};

// Run explorations
const runExploration = async () => {
  await exploreBybit();
  await tryBybitWithPost();
  await exploreBitget();
};

runExploration();