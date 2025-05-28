import React from 'react';
import './LandingPage.css';
import { Shield, Users, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <h1 className="logo">Cross Exchange Leaderboard</h1>
            <div className="nav-links">
              <a href="#dashboard">Dashboard</a>
              <a href="#discover">Discover KOLs</a>
              <a href="#portfolio">My Portfolio</a>
              <a href="#kol">KOL Dashboard</a>
            </div>
          </div>
          <div className="nav-right">
            <button className="connect-wallet-btn">Connect Wallet</button>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Copy Top Traders on <span className="gradient-text">Solana</span>
          </h1>
          <p className="hero-subtitle">
            Join the decentralized social trading revolution. Follow and automatically copy the strategies of verified<br />
            top traders with transparent on-chain performance tracking.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Discover KOLs</button>
            <button className="btn-secondary">Become a KOL</button>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">Why Choose Our Platform?</h2>
          <p className="features-subtitle">Built on Solana for speed, transparency, and low fees</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={40} />
              </div>
              <h3>Verifiable On-Chain P&L</h3>
              <p>All trading performance is transparently tracked and verified on the Solana blockchain</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={40} />
              </div>
              <h3>Top KOLs & Traders</h3>
              <p>Follow experienced traders with proven track records across multiple decentralized exchanges</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={40} />
              </div>
              <h3>Fair Fee Structure</h3>
              <p>KOLs earn performance fees only when they make a profit. No hidden charges</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;