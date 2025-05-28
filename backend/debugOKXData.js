const axios = require('axios');

const debugOKXData = async () => {
  try {
    const response = await axios.get('https://www.okx.com/api/v5/copytrading/public-lead-traders', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://www.okx.com',
        'Referer': 'https://www.okx.com/copy-trading/leaderboard'
      }
    });

    if (response.data && response.data.data && response.data.data.length > 0) {
      const traders = response.data.data[0].ranks || [];
      
      console.log('Total traders found:', traders.length);
      console.log('\nFirst 5 traders data:\n');
      
      traders.slice(0, 5).forEach((trader, index) => {
        console.log(`\n=== Trader ${index + 1} ===`);
        console.log('Nickname:', trader.nickName);
        console.log('PNL:', trader.pnl);
        console.log('PNL Ratio:', trader.pnlRatio, '(this should be ROI)');
        console.log('Win Ratio:', trader.winRatio);
        console.log('AUM:', trader.aum);
        console.log('Copy Traders:', trader.copyTraderNum);
        console.log('Lead Days:', trader.leadDays);
        
        // Check for time-based ratios
        if (trader.pnlRatios) {
          console.log('\nTime-based PNL Ratios:');
          trader.pnlRatios.forEach(ratio => {
            console.log(`  ${ratio.period || 'Period'}: ${ratio.value}%`);
          });
        }
        
        // Log all fields to see what's available
        console.log('\nAll available fields:', Object.keys(trader));
      });
      
      // Check data format
      console.log('\n\nSample raw trader object:');
      console.log(JSON.stringify(traders[0], null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

debugOKXData();