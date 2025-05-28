import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';
import { Shield, Users, Zap, ArrowRight, Globe, Twitter, Github, MessageCircle, ChevronDown, ChevronUp, Rocket } from 'lucide-react';

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);


  const FloatingParticles = () => {
    return (
      <div className="floating-particles">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              '--delay': `${Math.random() * 20}s`,
              '--duration': `${15 + Math.random() * 10}s`,
              '--size': `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`
            }}
          />
        ))}
      </div>
    );
  };

  const InteractiveGrid = () => {
    return (
      <div className="interactive-grid">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="grid-dot"
            style={{
              '--mouse-x': mousePosition.x,
              '--mouse-y': mousePosition.y,
              '--index': i
            }}
          />
        ))}
      </div>
    );
  };

  const faqs = [
    {
      question: "How does the cross-exchange trading work?",
      answer: "Our platform aggregates real-time leaderboard data from all major exchanges. You can analyze top traders' performance and execute similar trades directly through our unified interface with your connected exchange accounts."
    },
    {
      question: "What exchanges are supported?",
      answer: "We currently support Binance, OKX, Bybit, Bitget, and Hyperliquid perpetual futures markets. More exchanges are being added regularly based on user demand."
    },
    {
      question: "How is trader data verified?",
      answer: "All leaderboard data is pulled directly from official exchange APIs in real-time. We aggregate and display verified performance metrics including ROI, PNL, win rates, and trading volume."
    },
    {
      question: "What are the fees?",
      answer: "Openliquid charges a small platform fee for trade execution. Individual exchange fees apply as per their standard rate structures. No hidden fees or markup on spreads."
    },
  ];

  return (
    <div className="landing-page">
      <FloatingParticles />
      <InteractiveGrid />
      
      <nav className="navbar glass-effect">
        <div className="nav-container">
          <div className="nav-left">
            <h1 className="logo morphing-logo" onClick={() => window.location.href = '/'}>
              <span className="logo-text">
                <span className="logo-open">Open</span>
                <span className="logo-liquid">liquid</span>
              </span>
              <div className="logo-glow"></div>
            </h1>
            <div className="nav-links">
              <a href="#dashboard" className="nav-link">Dashboard</a>
              <a href="#discover" className="nav-link">Discover KOLs</a>
              <a href="#portfolio" className="nav-link">My Portfolio</a>
              <a href="#kol" className="nav-link">KOL Dashboard</a>
            </div>
          </div>
          <div className="nav-right">
            <button className="launch-app-btn magnetic-btn">
              <span>Launch App</span>
              <div className="btn-glow"></div>
            </button>
          </div>
        </div>
      </nav>

      <section ref={heroRef} className="hero-section" id="hero" data-animate>
        <div className="hero-bg-elements">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="neural-network">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="neural-node" style={{ '--index': i }}></div>
            ))}
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge glowing-badge">
            <span className="badge-icon">🔥</span>
            <span className="badge-text">Now Live</span>
            <div className="badge-pulse"></div>
          </div>
          
          <h1 className="hero-title typing-effect">
            Copy Top Traders Across <span className="gradient-text morphing-text">All Exchanges</span>
          </h1>
          
          <p className="hero-subtitle fade-in-up">
            Discover and follow the best perpetual futures traders across all major exchanges.<br />
            Open positions directly from our unified platform with real-time leaderboard data.
          </p>
          
          <div className="hero-buttons">
            <button className="btn-primary magnetic-btn hover-lift">
              <span>Discover KOLs</span>
              <div className="btn-particles"></div>
            </button>
            <button className="btn-secondary magnetic-btn hover-lift">
              <span>Become a KOL</span>
              <div className="btn-border-glow"></div>
            </button>
          </div>
        </div>
      </section>


      <section className="features-section" id="features" data-animate>
        <div className="features-container">
          <h2 className="features-title glitch-text">Why Choose Our Platform?</h2>
          <p className="features-subtitle">Unified access to top traders across all major exchanges</p>
          
          <div className="features-grid">
            <div className="feature-card floating-card" data-tilt>
              <div className="feature-icon rotating-icon">
                <Shield size={40} />
                <div className="icon-pulse"></div>
              </div>
              <h3>Real-Time Leaderboards</h3>
              <p>Live aggregated performance data from all major exchanges updated every minute</p>
              <div className="card-glow"></div>
            </div>
            
            <div className="feature-card floating-card" data-tilt>
              <div className="feature-icon rotating-icon">
                <Users size={40} />
                <div className="icon-pulse"></div>
              </div>
              <h3>Multi-Exchange Coverage</h3>
              <p>Copy traders from Binance, OKX, Bybit, Bitget & Hyperliquid all in one place</p>
              <div className="card-glow"></div>
            </div>
            
            <div className="feature-card floating-card" data-tilt>
              <div className="feature-icon rotating-icon">
                <Zap size={40} />
                <div className="icon-pulse"></div>
              </div>
              <h3>Unified Trading Interface</h3>
              <p>One platform to track, analyze, and execute perpetual futures trades across all exchanges</p>
              <div className="card-glow"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Start trading with top performers in just 4 simple steps</p>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Explore Leaderboards</h3>
              <p>Browse top traders across all exchanges without any setup required.</p>
            </div>
            <div className="step-arrow">
              <ArrowRight size={24} />
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Pick Winners</h3>
              <p>Analyze performance stats and find profitable traders to follow.</p>
            </div>
            <div className="step-arrow">
              <ArrowRight size={24} />
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Set Your Style</h3>
              <p>Choose how much to copy and configure your risk preferences.</p>
            </div>
            <div className="step-arrow">
              <ArrowRight size={24} />
            </div>
            <div className="step-card">
              <div className="step-number">04</div>
              <h3>Start Copying</h3>
              <p>Automatically mirror trades from your chosen traders in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="exchanges-section">
        <div className="container">
          <h2 className="section-title">Supported Exchanges</h2>
          <p className="section-subtitle">Access perpetual futures markets across all major centralized exchanges</p>
          
          <div className="exchanges-grid">
            <div className="exchange-card">
              <div className="exchange-logo binance">Binance</div>
              <div className="exchange-stats">
                <span className="traders-count">4,283 traders</span>
                <span className="volume">$284M volume</span>
              </div>
            </div>
            <div className="exchange-card">
              <div className="exchange-logo okx">OKX</div>
              <div className="exchange-stats">
                <span className="traders-count">2,847 traders</span>
                <span className="volume">$193M volume</span>
              </div>
            </div>
            <div className="exchange-card">
              <div className="exchange-logo bybit">Bybit</div>
              <div className="exchange-stats">
                <span className="traders-count">3,192 traders</span>
                <span className="volume">$227M volume</span>
              </div>
            </div>
            <div className="exchange-card">
              <div className="exchange-logo bitget">Bitget</div>
              <div className="exchange-stats">
                <span className="traders-count">1,738 traders</span>
                <span className="volume">$98M volume</span>
              </div>
            </div>
            <div className="exchange-card">
              <div className="exchange-logo hyperliquid">Hyperliquid</div>
              <div className="exchange-stats">
                <span className="traders-count">787 traders</span>
                <span className="volume">$45M volume</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Everything you need to know about cross-exchange trading</p>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Trading?</h2>
            <p className="cta-subtitle">Join thousands of traders using cross-exchange insights to maximize profits</p>
            <div className="cta-buttons">
              <button className="btn-primary large">
                <Rocket size={20} />
                Launch App
              </button>
              <button className="btn-secondary large">
                <MessageCircle size={20} />
                Join Community
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4 className="footer-title">Openliquid</h4>
              <p className="footer-description">
                The ultimate cross-exchange perpetual futures trading platform
              </p>
              <div className="social-links">
                <button className="social-link"><Twitter size={20} /></button>
                <button className="social-link"><MessageCircle size={20} /></button>
                <button className="social-link"><Github size={20} /></button>
                <button className="social-link"><Globe size={20} /></button>
              </div>
            </div>
            
            <div className="footer-section">
              <h5>Product</h5>
              <ul className="footer-links">
                <li><button className="footer-link">Dashboard</button></li>
                <li><button className="footer-link">Discover KOLs</button></li>
                <li><button className="footer-link">Leaderboard</button></li>
                <li><button className="footer-link">API Docs</button></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h5>Company</h5>
              <ul className="footer-links">
                <li><button className="footer-link">About Us</button></li>
                <li><button className="footer-link">Blog</button></li>
                <li><button className="footer-link">Careers</button></li>
                <li><button className="footer-link">Contact</button></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h5>Resources</h5>
              <ul className="footer-links">
                <li><button className="footer-link">Documentation</button></li>
                <li><button className="footer-link">Help Center</button></li>
                <li><button className="footer-link">Terms of Service</button></li>
                <li><button className="footer-link">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 Openliquid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;