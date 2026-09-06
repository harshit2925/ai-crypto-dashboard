import React, { useState, useEffect } from 'react';
import './WelcomeAnimation.css';

export default function WelcomeAnimation({ onAnimationComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    // 6 second countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Close after 6 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onAnimationComplete();
      }, 500);
    }, 6000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(timer);
    };
  }, [onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="welcome-overlay">
      {/* Full Screen Stock Chart Background */}
      <div className="chart-bg-container">
        <svg viewBox="0 0 1200 800" className="stock-chart-bg">
          {/* Grid Lines */}
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0, 217, 255, 0.05)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="1200" height="800" fill="url(#grid)" />
          
          {/* Animated Chart Line */}
          <polyline
            points="50,700 150,600 250,550 350,450 450,400 550,300 650,250 750,150 850,100 950,50 1050,30 1150,20"
            className="chart-line-bg"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Animated Candlesticks */}
          <g className="candlestick-bg candlestick-bg-1">
            <line x1="150" y1="650" x2="150" y2="550" strokeWidth="3" />
            <rect x="130" y="600" width="40" height="50" />
          </g>
          
          <g className="candlestick-bg candlestick-bg-2">
            <line x1="350" y1="550" x2="350" y2="420" strokeWidth="3" />
            <rect x="330" y="485" width="40" height="65" />
          </g>
          
          <g className="candlestick-bg candlestick-bg-3">
            <line x1="550" y1="450" x2="550" y2="280" strokeWidth="3" />
            <rect x="530" y="365" width="40" height="85" />
          </g>
          
          <g className="candlestick-bg candlestick-bg-4">
            <line x1="750" y1="350" x2="750" y2="120" strokeWidth="3" />
            <rect x="730" y="235" width="40" height="115" />
          </g>
          
          <g className="candlestick-bg candlestick-bg-5">
            <line x1="950" y1="200" x2="950" y2="20" strokeWidth="3" />
            <rect x="930" y="110" width="40" height="90" />
          </g>
          
          {/* Rising Arrow */}
          <g className="arrow-group-bg">
            <line x1="1000" y1="250" x2="1100" y2="50" strokeWidth="5" />
            <polygon points="1100,50 1085,75 1105,60" />
          </g>
          
          {/* Growth Percentage */}
          <text x="600" y="750" className="chart-text-bg">📈 +142% Growth</text>
        </svg>
      </div>

      <div className="welcome-container">
        {/* Animated Background - 8 Crypto Symbols */}
        <div className="welcome-bg">
          <div className="crypto-shape crypto-shape-1">₿</div>
          <div className="crypto-shape crypto-shape-2">Ξ</div>
          <div className="crypto-shape crypto-shape-3">◎</div>
          <div className="crypto-shape crypto-shape-4">✕</div>
          <div className="crypto-shape crypto-shape-5">Ð</div>
          <div className="crypto-shape crypto-shape-6">₳</div>
          <div className="crypto-shape crypto-shape-7">₹</div>
          <div className="crypto-shape crypto-shape-8">◈</div>
        </div>

        {/* Main Content */}
        <div className="welcome-content">
          <div className="welcome-icon">💹</div>
          
          <h1 className="welcome-title">Welcome to the World of Crypto</h1>
          
          <div className="welcome-subtitle">
            <p>Your journey to financial freedom starts now</p>
          </div>

          {/* Feature Display */}
          <div className="welcome-features">
            <div className="feature">
              <span className="feature-icon">💰</span>
              <span className="feature-text">Buy & Sell</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span className="feature-text">Track Portfolio</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🤖</span>
              <span className="feature-text">AI Assistant</span>
            </div>
          </div>

          {/* Loading Prompts */}
          <div className="welcome-prompts">
            <p className="prompt-text">Loading your dashboard...</p>
            <p className="prompt-text secondary">Preparing your crypto experience</p>
          </div>

          {/* Animated Loader */}
          <div className="welcome-loader">
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
          </div>

          {/* Countdown Timer */}
          <div className="countdown">
            <p>Entering dashboard in <span className="countdown-number">{countdown}s</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}