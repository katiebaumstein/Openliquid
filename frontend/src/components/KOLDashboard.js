import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './KOLDashboard.css';
import { TrendingUp, TrendingDown, Trophy, Users, Activity, DollarSign, Percent, Clock, Filter, Search, ChevronDown, RefreshCw, Zap, Award, Target, Home, ArrowLeft } from 'lucide-react';
import { fetchLeaderboard } from '../services/api';

const KOLDashboard = () => {
  const navigate = useNavigate();
  const [traders, setTraders] = useState([]);
  const [filteredTraders, setFilteredTraders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExchange, setSelectedExchange] = useState('all');
  const [sortBy, setSortBy] = useState('roi');
  const [timeframe, setTimeframe] = useState('7d');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedTrader, setExpandedTrader] = useState(null);

  const exchanges = [
    { id: 'all', name: 'All Exchanges', icon: '🌐' },
    { id: 'binance', name: 'Binance', icon: '🔶' },
    { id: 'okx', name: 'OKX', icon: '⚪' },
    { id: 'bybit', name: 'Bybit', icon: '🟠' },
    { id: 'bitget', name: 'Bitget', icon: '🔵' },
    { id: 'hyperliquid', name: 'Hyperliquid', icon: '🟣' }
  ];

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [selectedExchange]);

  useEffect(() => {
    filterAndSortTraders();
  }, [traders, searchTerm, sortBy, selectedExchange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchLeaderboard(selectedExchange === 'all' ? '' : selectedExchange);
      setTraders(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const filterAndSortTraders = () => {
    let filtered = [...traders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(trader => 
        trader.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'roi':
          return (b.roi || 0) - (a.roi || 0);
        case 'pnl':
          return (b.pnl || 0) - (a.pnl || 0);
        case 'winRate':
          return (b.winRate || 0) - (a.winRate || 0);
        case 'rank':
          return (a.rank || 999) - (b.rank || 999);
        default:
          return 0;
      }
    });

    setFilteredTraders(filtered);
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const formatPercentage = (num) => {
    if (!num && num !== 0) return '0%';
    // If the number is already a percentage, just format it
    return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  const getExchangeColor = (exchange) => {
    const colors = {
      binance: '#F0B90B',
      okx: '#FFFFFF',
      bybit: '#F7A600',
      bitget: '#00D4E4',
      hyperliquid: '#8B5CF6'
    };
    return colors[exchange] || '#888';
  };

  const getTrendingTraders = () => {
    return filteredTraders
      .filter(t => t.roi > 50)
      .slice(0, 4);
  };

  if (loading && traders.length === 0) {
    return (
      <div className="kol-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading top traders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kol-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-container">
          <h1 className="nav-logo" onClick={() => navigate('/')}>
            <span className="logo-open">Open</span>
            <span className="logo-liquid">liquid</span>
          </h1>
        </div>
      </nav>
      
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <Trophy className="title-icon" />
            Cross-Exchange KOL Leaderboard
          </h1>
          <p className="dashboard-subtitle">
            Real-time performance tracking across all major perpetual futures exchanges
          </p>
        </div>
        <button className={`refresh-btn ${refreshing ? 'refreshing' : ''}`} onClick={handleRefresh}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Trending Section */}
      <div className="trending-section">
        <h2 className="section-title">
          <Zap className="section-icon" />
          Trending KOLs
          <span className="section-subtitle">Top performers in the last 24 hours</span>
        </h2>
        <div className="trending-grid">
          {getTrendingTraders().map((trader, index) => (
            <div key={trader.id} className="trending-card">
              <div className="trending-rank">#{index + 1}</div>
              <div className="trending-info">
                <h3>{trader.nickname || 'Anonymous'}</h3>
                <span className="exchange-badge" style={{ backgroundColor: getExchangeColor(trader.exchange) }}>
                  {trader.exchange?.toUpperCase()}
                </span>
              </div>
              <div className="trending-stats">
                <div className="stat-item">
                  <span className="stat-label">ROI</span>
                  <span className={`stat-value ${trader.roi > 0 ? 'positive' : 'negative'}`}>
                    {formatPercentage(trader.roi)}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">PNL</span>
                  <span className={`stat-value ${trader.pnl > 0 ? 'positive' : 'negative'}`}>
                    ${formatNumber(trader.pnl)}
                  </span>
                </div>
              </div>
              <div className="trending-chart">
                {/* Placeholder for mini chart */}
                <svg viewBox="0 0 100 40" className="mini-chart">
                  <path
                    d="M0,30 Q25,10 50,20 T100,15"
                    fill="none"
                    stroke="#00ff88"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-row">
          <div className="exchange-filters">
            {exchanges.map(exchange => (
              <button
                key={exchange.id}
                className={`exchange-filter ${selectedExchange === exchange.id ? 'active' : ''}`}
                onClick={() => setSelectedExchange(exchange.id)}
              >
                <span className="exchange-icon">{exchange.icon}</span>
                {exchange.name}
              </button>
            ))}
          </div>
          
          <div className="filter-controls">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search traders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="roi">Sort by ROI</option>
              <option value="pnl">Sort by PNL</option>
              <option value="winRate">Sort by Win Rate</option>
              <option value="rank">Sort by Rank</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Leaderboard */}
      <div className="leaderboard-section">
        <div className="leaderboard-header">
          <div className="header-cell rank">Rank</div>
          <div className="header-cell trader">Trader</div>
          <div className="header-cell roi">ROI ({timeframe})</div>
          <div className="header-cell pnl">Total PNL</div>
          <div className="header-cell winrate">Win Rate</div>
          <div className="header-cell exchange">Exchange</div>
          <div className="header-cell actions">Actions</div>
        </div>
        
        <div className="leaderboard-body">
          {filteredTraders.map((trader, index) => (
            <div 
              key={trader.id} 
              className={`trader-row ${expandedTrader === trader.id ? 'expanded' : ''}`}
              onClick={() => setExpandedTrader(expandedTrader === trader.id ? null : trader.id)}
            >
              <div className="trader-main">
                <div className="row-cell rank">
                  <div className={`rank-badge ${index < 3 ? 'top-three' : ''}`}>
                    {index === 0 && <Trophy size={20} className="gold" />}
                    {index === 1 && <Award size={20} className="silver" />}
                    {index === 2 && <Target size={20} className="bronze" />}
                    {index + 1}
                  </div>
                </div>
                
                <div className="row-cell trader">
                  <div className="trader-avatar">
                    {trader.nickname?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="trader-info">
                    <h4>{trader.nickname || 'Anonymous'}</h4>
                    <span className="trader-id">ID: {trader.userId || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="row-cell roi">
                  <span className={`metric ${trader.roi > 0 ? 'positive' : 'negative'}`}>
                    {trader.roi > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {formatPercentage(trader.roi)}
                  </span>
                </div>
                
                <div className="row-cell pnl">
                  <span className={`metric ${trader.pnl > 0 ? 'positive' : 'negative'}`}>
                    ${formatNumber(trader.pnl)}
                  </span>
                </div>
                
                <div className="row-cell winrate">
                  <div className="winrate-container">
                    <span className="winrate-value">{trader.winRate?.toFixed(1) || '0'}%</span>
                    <div className="winrate-bar">
                      <div 
                        className="winrate-fill" 
                        style={{ width: `${Math.min(trader.winRate || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="row-cell exchange">
                  <span 
                    className="exchange-tag"
                    style={{ 
                      backgroundColor: `${getExchangeColor(trader.exchange)}20`,
                      color: getExchangeColor(trader.exchange)
                    }}
                  >
                    {trader.exchange?.toUpperCase()}
                  </span>
                </div>
                
                <div className="row-cell actions">
                  <button className="action-btn follow-btn">
                    <Users size={16} />
                    Follow
                  </button>
                  <button className="action-btn view-btn">
                    <Activity size={16} />
                    View
                  </button>
                </div>
              </div>
              
              {expandedTrader === trader.id && (
                <div className="trader-expanded">
                  <div className="expanded-content">
                    <div className="stat-group">
                      <h5>Performance Metrics</h5>
                      <div className="stats-grid">
                        <div className="stat">
                          <span className="stat-label">Total ROI</span>
                          <span className="stat-value">{formatPercentage(trader.roi)}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Total PNL</span>
                          <span className="stat-value">${formatNumber(trader.pnl)}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Win Rate</span>
                          <span className="stat-value">{trader.winRate?.toFixed(1) || '0'}%</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Lead Days</span>
                          <span className="stat-value">{trader.leadDays || 'N/A'}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">AUM</span>
                          <span className="stat-value">${formatNumber(trader.aum || 0)}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Followers</span>
                          <span className="stat-value">{trader.followers || 0}/{trader.maxFollowers || 'N/A'}</span>
                        </div>
                      </div>
                      {trader.instruments && trader.instruments.length > 0 && (
                        <div className="instruments-section">
                          <h6>Trading Instruments</h6>
                          <div className="instruments-list">
                            {trader.instruments.map((inst, idx) => (
                              <span key={idx} className="instrument-tag">{inst}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="performance-chart">
                      {/* Placeholder for performance chart */}
                      <div className="chart-placeholder">Performance chart coming soon...</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {filteredTraders.length === 0 && (
        <div className="empty-state">
          <p>No traders found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default KOLDashboard;