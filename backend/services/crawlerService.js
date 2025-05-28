const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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
    const response = await axios.get('https://www.okx.com/priapi/v5/ecotrade/public/profit-sharing-rank', {
      params: {
        instType: 'SWAP',
        sortType: '7D_TOTAL_YIELD_RATE',
        pageNo: 1,
        pageSize: 50
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data && response.data.data && response.data.data.ranks) {
      return response.data.data.ranks.map((trader, index) => normalizeTraderData({
        nickname: trader.nickName,
        roi: trader.yieldRate,
        pnl: trader.totalPnl,
        rank: index + 1,
        winRate: trader.winRate,
        userId: trader.uniqueName
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