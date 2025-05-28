import React from 'react';
import { Users, TrendingUp, Award, Activity } from 'lucide-react';

const StatsOverview = ({ data }) => {
  if (!data) return null;

  const calculateStats = () => {
    const allTraders = data.aggregated || [];
    const totalTraders = allTraders.length;
    
    const avgROI = totalTraders > 0
      ? (allTraders.reduce((sum, t) => sum + (parseFloat(t.roi) || 0), 0) / totalTraders).toFixed(2)
      : 0;
    
    const topROI = allTraders[0]?.roi || 0;
    const activeExchanges = Object.keys(data).filter(k => k !== 'aggregated' && data[k].length > 0).length;

    return { totalTraders, avgROI, topROI, activeExchanges };
  };

  const stats = calculateStats();

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <Users size={24} className="stat-icon" />
        <div className="stat-value gradient-text">{stats.totalTraders}</div>
        <div className="stat-label">Total Traders</div>
      </div>
      
      <div className="stat-card">
        <TrendingUp size={24} className="stat-icon" />
        <div className="stat-value positive">{stats.avgROI}%</div>
        <div className="stat-label">Average ROI</div>
      </div>
      
      <div className="stat-card">
        <Award size={24} className="stat-icon" />
        <div className="stat-value positive">{stats.topROI}%</div>
        <div className="stat-label">Top ROI</div>
      </div>
      
      <div className="stat-card">
        <Activity size={24} className="stat-icon" />
        <div className="stat-value">{stats.activeExchanges}</div>
        <div className="stat-label">Active Exchanges</div>
      </div>
    </div>
  );
};

const styles = `
.stat-icon {
  color: #00ff88;
  margin-bottom: 12px;
}
`;

export default StatsOverview;