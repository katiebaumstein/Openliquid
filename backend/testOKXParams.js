const axios = require('axios');

const testOKXParams = async () => {
  console.log('Testing OKX with different parameters...\n');
  
  const baseUrl = 'https://www.okx.com/api/v5/copytrading/public-lead-traders';
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'Origin': 'https://www.okx.com',
    'Referer': 'https://www.okx.com/copy-trading/leaderboard'
  };

  const paramSets = [
    {
      name: 'Basic params',
      params: {}
    },
    {
      name: 'With instType only',
      params: { instType: 'SWAP' }
    },
    {
      name: 'With different sort',
      params: { 
        instType: 'SWAP',
        sortBy: 'pnlRatio'
      }
    },
    {
      name: 'Minimal params',
      params: { 
        limit: '20'
      }
    },
    {
      name: 'With time range',
      params: {
        instType: 'SWAP',
        period: '7d'
      }
    }
  ];

  for (const paramSet of paramSets) {
    try {
      console.log(`\nTrying ${paramSet.name}...`);
      console.log('Params:', paramSet.params);
      
      const response = await axios.get(baseUrl, {
        params: paramSet.params,
        headers: headers
      });
      
      console.log('✅ Success!');
      console.log('Response code:', response.data.code);
      console.log('Data structure:', Object.keys(response.data));
      if (response.data.data && response.data.data.length > 0) {
        console.log('First item structure:', Object.keys(response.data.data[0]));
        console.log('Sample trader:', JSON.stringify(response.data.data[0].ranks?.[0] || response.data.data[0]).substring(0, 200));
      }
      return;
    } catch (error) {
      console.log('❌ Failed:', error.response?.status, error.response?.data?.msg || error.message);
    }
  }
};

testOKXParams();