const axios = require('axios');
const puppeteer = require('puppeteer');

// Common browser headers
const browserHeaders = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin'
};

// Test OKX Copy Trading with new endpoints
const testOKXv2 = async () => {
  console.log('\n=== Testing OKX V2 ===');
  
  const endpoints = [
    {
      name: 'Copy Trading Leaders',
      url: 'https://www.okx.com/priapi/v5/ecotrade/public/leader-ranks',
      params: {
        instType: 'SWAP',
        sortType: 'PROFIT_RATE',
        timeRange: 'ONE_WEEK',
        pageNo: 1,
        pageSize: 20
      }
    },
    {
      name: 'Copy Trading Rankings',
      url: 'https://www.okx.com/api/v5/copytrading/public-lead-traders',
      params: {
        instType: 'SWAP',
        sortBy: 'pnl',
        limit: 20
      }
    }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\nTrying ${endpoint.name}...`);
      const response = await axios.get(endpoint.url, {
        params: endpoint.params,
        headers: {
          ...browserHeaders,
          'Origin': 'https://www.okx.com',
          'Referer': 'https://www.okx.com/zh-hans/copy-trading/leaderboard'
        }
      });
      console.log('✅ Success:', endpoint.url);
      console.log('Response:', JSON.stringify(response.data).substring(0, 300));
      return response.data;
    } catch (error) {
      console.log('❌ Failed:', error.message);
    }
  }
};

// Test Bitget with various endpoints
const testBitgetV2 = async () => {
  console.log('\n=== Testing Bitget V2 ===');
  
  const endpoints = [
    {
      name: 'Copy Trading Leaderboard',
      url: 'https://api.bitget.com/api/mix/v1/copytrade/public/current-track',
      method: 'GET'
    },
    {
      name: 'Trader Rankings',
      url: 'https://api.bitget.com/api/v2/copy/mix-trader/public-ranking',
      method: 'POST',
      data: {
        pageNo: 1,
        pageSize: 20,
        sortBy: 'ROI_7D',
        isDesc: true
      }
    },
    {
      name: 'Leader List',
      url: 'https://api.bitget.com/api/v2/copy/mix-trader/public-traders',
      method: 'GET',
      params: {
        limit: 20,
        offset: 0
      }
    }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\nTrying ${endpoint.name}...`);
      const config = {
        headers: {
          ...browserHeaders,
          'Origin': 'https://www.bitget.com',
          'Referer': 'https://www.bitget.com/copy-trading/leaderboard-ranking/futures-roi'
        }
      };

      let response;
      if (endpoint.method === 'POST') {
        response = await axios.post(endpoint.url, endpoint.data || {}, config);
      } else {
        response = await axios.get(endpoint.url, { ...config, params: endpoint.params });
      }
      
      console.log('✅ Success:', endpoint.url);
      console.log('Response:', JSON.stringify(response.data).substring(0, 300));
      return response.data;
    } catch (error) {
      console.log('❌ Failed:', error.message);
      if (error.response?.data) {
        console.log('Error details:', JSON.stringify(error.response.data).substring(0, 200));
      }
    }
  }
};

// Test Hyperliquid with Puppeteer
const testHyperliquidV2 = async () => {
  console.log('\n=== Testing Hyperliquid V2 ===');
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set up request interception to capture API calls
    const apiCalls = [];
    page.on('response', response => {
      const url = response.url();
      if (url.includes('api') || url.includes('leaderboard')) {
        apiCalls.push({
          url: url,
          status: response.status(),
          method: response.request().method()
        });
      }
    });
    
    console.log('Loading Hyperliquid page...');
    await page.goto('https://app.hyperliquid.xyz/leaderboard', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    console.log('Captured API calls:');
    apiCalls.forEach(call => {
      console.log(`- ${call.method} ${call.url} (${call.status})`);
    });
    
    // Try to extract data from the page
    const leaderboardData = await page.evaluate(() => {
      // Look for any data in window object
      if (window.__INITIAL_STATE__) return window.__INITIAL_STATE__;
      if (window.leaderboardData) return window.leaderboardData;
      
      // Try to find data in the DOM
      const rows = document.querySelectorAll('tr[data-row-key]');
      if (rows.length > 0) {
        return Array.from(rows).map(row => {
          const cells = row.querySelectorAll('td');
          return {
            rank: cells[0]?.textContent,
            trader: cells[1]?.textContent,
            pnl: cells[2]?.textContent,
            roi: cells[3]?.textContent
          };
        });
      }
      
      return null;
    });
    
    if (leaderboardData) {
      console.log('✅ Found leaderboard data');
      console.log('Sample:', JSON.stringify(leaderboardData).substring(0, 300));
    }
    
  } catch (error) {
    console.log('❌ Hyperliquid failed:', error.message);
  } finally {
    if (browser) await browser.close();
  }
};

// Test Binance with alternative endpoints
const testBinanceV2 = async () => {
  console.log('\n=== Testing Binance V2 ===');
  
  const endpoints = [
    {
      name: 'Futures Leaderboard Base',
      url: 'https://www.binance.com/bapi/futures/v2/public/future/leaderboard/getOtherPosition',
      params: {
        encryptedUid: '',
        type: 'PERPETUAL'
      }
    },
    {
      name: 'Copy Trading Leaders',
      url: 'https://www.binance.com/bapi/futures/v1/public/future/copy-trade/lead-portfolio/list',
      params: {
        limit: 20,
        offset: 0
      }
    }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\nTrying ${endpoint.name}...`);
      const response = await axios.get(endpoint.url, {
        params: endpoint.params,
        headers: {
          ...browserHeaders,
          'Origin': 'https://www.binance.com',
          'Referer': 'https://www.binance.com/en/futures-activity/leaderboard'
        }
      });
      console.log('✅ Success:', endpoint.url);
      console.log('Response:', JSON.stringify(response.data).substring(0, 300));
      return response.data;
    } catch (error) {
      console.log('❌ Failed:', error.message);
      if (error.response?.status === 451) {
        console.log('Geo-restricted. Need VPN or proxy.');
      }
    }
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('Testing Exchange APIs V2...\n');
  await testOKXv2();
  await testBitgetV2();
  await testHyperliquidV2();
  await testBinanceV2();
  console.log('\n=== Tests Complete ===');
};

runAllTests();