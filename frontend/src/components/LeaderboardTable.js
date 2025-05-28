import React from 'react';
import { Trophy, TrendingUp, TrendingDown, User } from 'lucide-react';

const LeaderboardTable = ({ data, exchange, loading }) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <p>No traders found for this exchange.</p>
      </div>
    );
  }

  const formatROI = (roi) => {
    const value = parseFloat(roi) || 0;
    return (
      <span className={value >= 0 ? 'positive' : 'negative'}>
        {value >= 0 ? '+' : ''}{value.toFixed(2)}%
      </span>
    );
  };

  const formatPNL = (pnl) => {
    const value = parseFloat(pnl) || 0;
    return (
      <span className={value >= 0 ? 'positive' : 'negative'}>
        ${Math.abs(value).toLocaleString()}
      </span>
    );
  };

  const getExchangeBadge = (exchangeName) => {
    return <span className={`badge badge-${exchangeName}`}>{exchangeName.toUpperCase()}</span>;
  };

  return (
    <div className="card">
      <h2 className="table-title">
        <Trophy size={24} />
        {exchange === 'aggregated' ? 'Global Leaderboard' : `${exchange.charAt(0).toUpperCase() + exchange.slice(1)} Leaderboard`}
      </h2>
      
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Trader</th>
              {exchange === 'aggregated' && <th>Exchange</th>}
              <th>ROI</th>
              <th>PNL</th>
              <th>Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 50).map((trader, index) => (
              <tr key={trader.id || index}>
                <td>
                  <div className="rank">
                    {trader.globalRank || trader.rank || index + 1}
                    {(trader.globalRank || trader.rank || index + 1) <= 3 && (
                      <Trophy size={16} className="trophy-icon" />
                    )}
                  </div>
                </td>
                <td>
                  <div className="trader-info">
                    <User size={16} />
                    <span>{trader.nickname || 'Anonymous'}</span>
                  </div>
                </td>
                {exchange === 'aggregated' && (
                  <td>{getExchangeBadge(trader.exchange)}</td>
                )}
                <td>{formatROI(trader.roi)}</td>
                <td>{formatPNL(trader.pnl)}</td>
                <td>
                  <span className="win-rate">
                    {parseFloat(trader.winRate || 0).toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = `
.table-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  margin-bottom: 24px;
  color: #fff;
}

.table-wrapper {
  overflow-x: auto;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #888;
}

.rank {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.trophy-icon {
  color: #ffd700;
}

.trader-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.win-rate {
  color: #888;
}
`;

export default LeaderboardTable;