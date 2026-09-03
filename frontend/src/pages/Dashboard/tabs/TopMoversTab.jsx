import React, { useState, useEffect } from 'react';
import './TopMoversTab.css';

export default function TopMoversTab() {
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopMovers();
  }, []);

  const fetchTopMovers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&price_change_percentage=24h'
      );
      const data = await response.json();

      // Sort by 24h change percentage
      const sorted = [...data].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
      
      // Get top 5 gainers
      const gainers = sorted.slice(0, 5);
      
      // Get top 5 losers
      const losers = sorted.slice(-5).reverse();

      setTopGainers(gainers);
      setTopLosers(losers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching top movers:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading market movers...</div>;
  }

  return (
    <div className="top-movers-container">
      <div className="refresh-section">
        <h2>🚀 Market Movers (24h)</h2>
        <button className="refresh-btn" onClick={fetchTopMovers}>🔄 Refresh</button>
      </div>

      <div className="movers-grid">
        {/* Top Gainers */}
        <div className="movers-section gainers">
          <h3>📈 Top Gainers</h3>
          <div className="movers-list">
            {topGainers.map((crypto, index) => (
              <div key={crypto.id} className="mover-card gainer">
                <div className="rank">#{index + 1}</div>
                <div className="mover-info">
                  <img src={crypto.image} alt={crypto.name} className="mover-icon" />
                  <div className="mover-details">
                    <div className="mover-name">{crypto.name}</div>
                    <div className="mover-symbol">{crypto.symbol.toUpperCase()}</div>
                  </div>
                </div>
                <div className="mover-price">
                  <div>${crypto.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="change positive">
                    ⬆️ {crypto.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="movers-section losers">
          <h3>📉 Top Losers</h3>
          <div className="movers-list">
            {topLosers.map((crypto, index) => (
              <div key={crypto.id} className="mover-card loser">
                <div className="rank">#{index + 1}</div>
                <div className="mover-info">
                  <img src={crypto.image} alt={crypto.name} className="mover-icon" />
                  <div className="mover-details">
                    <div className="mover-name">{crypto.name}</div>
                    <div className="mover-symbol">{crypto.symbol.toUpperCase()}</div>
                  </div>
                </div>
                <div className="mover-price">
                  <div>${crypto.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="change negative">
                    ⬇️ {crypto.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="insights-section">
        <h3>💡 Quick Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <span className="insight-label">Best Performer</span>
            <span className="insight-value">
              {topGainers[0]?.name} (+{topGainers[0]?.price_change_percentage_24h.toFixed(2)}%)
            </span>
          </div>
          <div className="insight-card">
            <span className="insight-label">Worst Performer</span>
            <span className="insight-value">
              {topLosers[0]?.name} ({topLosers[0]?.price_change_percentage_24h.toFixed(2)}%)
            </span>
          </div>
          <div className="insight-card">
            <span className="insight-label">Market Trend</span>
            <span className="insight-value">
              {topGainers.length > topLosers.length ? '🟢 Bullish' : '🔴 Bearish'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}