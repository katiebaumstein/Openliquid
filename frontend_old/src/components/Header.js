import React from 'react';
import { RefreshCw, TrendingUp, Users } from 'lucide-react';
import { format } from 'date-fns';

const Header = ({ lastUpdated, onRefresh }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">
              <TrendingUp size={32} className="header-icon" />
              <span className="gradient-text">Cross-Exchange Trading Leaderboard</span>
            </h1>
            <p className="header-subtitle">
              Track top traders across Binance, OKX, Bybit, Bitget & Hyperliquid
            </p>
          </div>
          
          <div className="header-right">
            {lastUpdated && (
              <span className="last-updated">
                Last updated: {format(new Date(lastUpdated), 'HH:mm:ss')}
              </span>
            )}
            <button onClick={onRefresh} className="refresh-button">
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const styles = `
.header {
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px 0;
  margin-bottom: 40px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left {
  flex: 1;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.header-icon {
  color: #00ff88;
}

.header-subtitle {
  color: #888;
  font-size: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.last-updated {
  color: #888;
  font-size: 14px;
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-button:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}
`;

export default Header;