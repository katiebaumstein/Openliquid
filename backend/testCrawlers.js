const axios = require('axios');

// Test Binance Futures Leaderboard
const testBinance = async () => {
  console.log('\n=== Testing Binance ===');
  try {
    // Try the new API endpoint
    const response = await axios.get('https://www.binance.com/bapi/futures/v3/public/future/leaderboard/getOtherLeaderboardBaseInfo', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://www.binance.com',
        'Referer': 'https://www.binance.com/en/futures-activity/leaderboard'
      }
    });
    console.log('✅ Binance API accessible');
    console.log('Sample response:', JSON.stringify(response.data).substring(0, 200));
  } catch (error) {
    console.log('❌ Binance failed:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
};

// Test OKX Copy Trading
const testOKX = async () => {
  console.log('\n=== Testing OKX ===');
  try {
    const response = await axios.get('https://www.okx.com/priapi/v5/ecotrade/public/ranking', {
      params: {
        't': Date.now(),
        'pageNo': 1,
        'pageSize': 20
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.okx.com/copy-trading/leaderboard'
      }
    });
    console.log('✅ OKX API accessible');
    console.log('Sample response:', JSON.stringify(response.data).substring(0, 200));
  } catch (error) {
    console.log('❌ OKX failed:', error.message);
  }
};

// Test Bybit Copy Trading
const testBybit = async () => {
  console.log('\n=== Testing Bybit ===');
  try {
    const response = await axios.get('https://api2.bybit.com/fapi/beehive/public/v1/common/leader-list', {
      params: {
        'pageNo': 1,
        'pageSize': 20,
        'timeRange': 7,
        'sortBy': 'ROI'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    console.log('✅ Bybit API accessible');
    console.log('Sample response:', JSON.stringify(response.data).substring(0, 200));
  } catch (error) {
    console.log('❌ Bybit failed:', error.message);
  }
};

// Test Bitget Copy Trading
const testBitget = async () => {
  console.log('\n=== Testing Bitget ===');
  try {
    const response = await axios.get('https://api.bitget.com/api/mix/v1/trace/currentTrack', {
      params: {
        'pageSize': 20,
        'pageNo': 1
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    console.log('✅ Bitget API accessible');
    console.log('Sample response:', JSON.stringify(response.data).substring(0, 200));
  } catch (error) {
    console.log('❌ Bitget failed:', error.message);
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('Testing Exchange APIs...\n');
  await testBinance();
  await testOKX();
  await testBybit();
  await testBitget();
  console.log('\n=== Tests Complete ===');
};

runAllTests();