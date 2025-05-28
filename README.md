# Cross-Exchange Trading Leaderboard

A real-time aggregator that crawls and displays trading leaderboards from multiple cryptocurrency exchanges including Binance, OKX, Bybit, Bitget, and Hyperliquid.

## Features

- **Multi-Exchange Support**: Aggregates data from 5 major exchanges
- **Real-Time Updates**: Auto-refreshes every 5 minutes
- **Global Leaderboard**: Combined ranking across all exchanges
- **Live Stats**: Average ROI, total traders, top performers
- **Responsive UI**: Modern dark theme with gradient accents

## Quick Start

1. Install dependencies:
```bash
npm run install-all
```

2. Start the application:
```bash
npm start
```

This will start both backend (port 5000) and frontend (port 3000) concurrently.

## Architecture

- **Backend**: Express.js server with crawler services
- **Frontend**: React application with real-time updates
- **Data Collection**: Automated crawlers for each exchange API

## Future Enhancements

- User accounts and authentication
- Copy trading functionality
- Database persistence
- On-chain integration (Solana)
- Advanced filtering and search
- Historical performance tracking