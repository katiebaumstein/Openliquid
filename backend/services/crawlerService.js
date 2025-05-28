const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

// Common browser headers
const browserHeaders = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
};

const normalizeTraderData = (trader, exchange) => {
  return {
    ...trader,
    exchange,
    timestamp: new Date(),
    id: `${exchange}_${trader.userId || trader.nickname || Math.random()}`
  };
};

const crawlBinance = async () => {
  try {
    const response = await axios.get('https://www.binance.com/bapi/futures/v1/public/future/leaderboard/getLeaderboardRank', {
      params: {
        isShared: true,
        isTrader: false,
        periodType: 'DAILY',
        statisticsType: 'ROI',
        tradeType: 'PERPETUAL'
      },
      headers: {
        ...browserHeaders,
        'Origin': 'https://www.binance.com',
        'Referer': 'https://www.binance.com/en/futures-activity/leaderboard'
      }
    });

    if (response.data && response.data.data) {
      return response.data.data.map(trader => normalizeTraderData({
        nickname: trader.nickName,
        roi: trader.value,
        pnl: trader.pnl,
        rank: trader.rank,
        winRate: trader.winRate,
        userId: trader.encryptedUid
      }, 'binance'));
    }
    return [];
  } catch (error) {
    console.error('Error crawling Binance:', error.message);
    return [];
  }
};

const crawlOKX = async () => {
  try {
    const response = await axios.get('https://www.okx.com/api/v5/copytrading/public-lead-traders', {
      headers: {
        ...browserHeaders,
        'Origin': 'https://www.okx.com',
        'Referer': 'https://www.okx.com/copy-trading/leaderboard'
      }
    });

    if (response.data && response.data.data && response.data.data.length > 0) {
      // OKX returns nested structure with ranks array
      const traders = response.data.data[0].ranks || [];
      return traders.slice(0, 50).map((trader, index) => normalizeTraderData({
        nickname: trader.nickName,
        roi: parseFloat(trader.pnlRatio || 0) * 100, // Convert to percentage (7.94 -> 794%)
        pnl: parseFloat(trader.pnl || 0),
        rank: index + 1,
        winRate: parseFloat(trader.winRatio || 0) * 100, // Convert to percentage (0.67 -> 67%)
        userId: trader.uniqueCode || trader.nickName,
        followers: parseInt(trader.copyTraderNum || 0),
        aum: parseFloat(trader.aum || 0),
        leadDays: parseInt(trader.leadDays || 0),
        maxFollowers: parseInt(trader.maxCopyTraderNum || 0),
        instruments: trader.traderInsts || []
      }, 'okx'));
    }
    return [];
  } catch (error) {
    console.error('Error crawling OKX:', error.message);
    return [];
  }
};

const crawlBybit = async () => {
  try {
    const response = await axios.post('https://api2.bybit.com/spot/api/copytrade/v1/master/list', {
      pageNo: 1,
      pageSize: 50,
      sortField: 'SEVEN_DAY_ROI',
      sortType: 'DESC'
    }, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.result && response.data.result.list) {
      return response.data.result.list.map((trader, index) => normalizeTraderData({
        nickname: trader.nickName,
        roi: trader.sevenDayRoi,
        pnl: trader.totalPnl,
        rank: index + 1,
        winRate: trader.winRate,
        userId: trader.leaderId
      }, 'bybit'));
    }
    return [];
  } catch (error) {
    console.error('Error crawling Bybit:', error.message);
    return [];
  }
};

const crawlBitget = async () => {
  try {
    const response = await axios.post('https://api.bitget.com/api/mix/v1/copytrade/public/leaderboard', {
      pageNo: 1,
      pageSize: 50,
      sortBy: 'TOTAL_PROFIT_RATE',
      timeRange: '7D'
    }, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.data && response.data.data.list) {
      return response.data.data.list.map((trader, index) => normalizeTraderData({
        nickname: trader.nickName,
        roi: trader.profitRate,
        pnl: trader.totalProfit,
        rank: index + 1,
        winRate: trader.winRate,
        userId: trader.traderId
      }, 'bitget'));
    }
    return [];
  } catch (error) {
    console.error('Error crawling Bitget:', error.message);
    return [];
  }
};

const crawlHyperliquid = async () => {
  try {
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.goto('https://app.hyperliquid.xyz/leaderboard', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    await page.waitForSelector('.leaderboard-table', { timeout: 10000 });

    const traders = await page.evaluate(() => {
      const rows = document.querySelectorAll('.leaderboard-table tbody tr');
      return Array.from(rows).slice(0, 50).map((row, index) => {
        const cells = row.querySelectorAll('td');
        return {
          nickname: cells[1]?.textContent?.trim() || 'Anonymous',
          roi: parseFloat(cells[2]?.textContent?.replace('%', '') || '0'),
          pnl: parseFloat(cells[3]?.textContent?.replace(/[$,]/g, '') || '0'),
          rank: index + 1,
          winRate: parseFloat(cells[4]?.textContent?.replace('%', '') || '0'),
          userId: cells[1]?.textContent?.trim() || `hl_${index}`
        };
      });
    });

    await browser.close();
    
    return traders.map(trader => normalizeTraderData(trader, 'hyperliquid'));
  } catch (error) {
    console.error('Error crawling Hyperliquid:', error.message);
    return [];
  }
};

module.exports = {
  crawlBinance,
  crawlOKX,
  crawlBybit,
  crawlBitget,
  crawlHyperliquid
};