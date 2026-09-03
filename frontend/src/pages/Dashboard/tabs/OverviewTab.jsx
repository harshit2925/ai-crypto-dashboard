import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import './OverviewTab.css';

export default function OverviewTab({ onNavigate }) {
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 0,
    change24h: 0,
    changePercent: 0,
    totalInvested: 0,
    gainLoss: 0,
    gainLossPercent: 0,
    holdings: [],
    topHolding: null,
    performanceData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = () => {
    let holdings = JSON.parse(localStorage.getItem('holdings') || '[]');

    // Add demo holdings if empty
    if (holdings.length === 0) {
      const demoHoldings = [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          quantity: 0.5,
          price: 42500,
          totalCost: 21250,
          boughtAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          quantity: 3,
          price: 2250,
          totalCost: 6750,
          boughtAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        },
        {
          symbol: 'SOL',
          name: 'Solana',
          quantity: 15,
          price: 98,
          totalCost: 1470,
          boughtAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        },
      ];
      localStorage.setItem('holdings', JSON.stringify(demoHoldings));
      holdings = demoHoldings;
    }

    if (holdings.length > 0) {
      const totalValue = holdings.reduce((sum, h) => sum + (h.quantity * h.price), 0);
      const totalInvested = holdings.reduce((sum, h) => sum + h.totalCost, 0);
      const gainLoss = totalValue - totalInvested;
      const gainLossPercent = totalInvested > 0 ? ((gainLoss / totalInvested) * 100).toFixed(2) : 0;

      const chartData = holdings.map(h => ({
        name: h.symbol.toUpperCase(),
        value: parseFloat((h.quantity * h.price).toFixed(2)),
        quantity: h.quantity,
      }));

      const topHolding = chartData.reduce((max, h) => h.value > max.value ? h : max, chartData[0]);

      // Create detailed 4-week performance data (daily data points)
      const performanceData = generateDetailedPerformanceData(totalInvested, totalValue);

      setPortfolioData({
        totalValue,
        change24h: totalValue * 0.025, // 2.5% of total (realistic 24h change)
        changePercent: 2.5,
        totalInvested,
        gainLoss,
        gainLossPercent,
        holdings: chartData,
        topHolding,
        performanceData,
      });
    } else {
      setPortfolioData({
        totalValue: 0,
        change24h: 0,
        changePercent: 0,
        totalInvested: 0,
        gainLoss: 0,
        gainLossPercent: 0,
        holdings: [],
        topHolding: null,
        performanceData: [],
      });
    }
    setLoading(false);
  };

  // Generate detailed 4-week performance data (daily points)
  const generateDetailedPerformanceData = (invested, current) => {
    const daysCount = 28; // 4 weeks
    const data = [];
    
    for (let i = 0; i < daysCount; i++) {
      // Calculate value for each day (simulate growth from invested to current)
      const progress = i / (daysCount - 1);
      const dayValue = invested + ((current - invested) * progress);
      
      // Add realistic volatility (crypto-like movements)
      const volatility = dayValue * (0.03 * Math.sin(i * 0.3) + 0.02 * Math.cos(i * 0.5));
      const randomVolatility = dayValue * 0.01 * (Math.random() - 0.5);
      
      const date = new Date();
      date.setDate(date.getDate() - (daysCount - i - 1));
      
      data.push({
        time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }),
        value: Math.round(dayValue + volatility + randomVolatility),
      });
    }
    
    return data;
  };

  const COLORS = ['#00d9ff', '#0099ff', '#00ff00', '#ffaa00', '#ff6b6b', '#ff00ff', '#00ffff', '#ffff00'];

  if (loading) {
    return <div className="overview-loading">Loading portfolio...</div>;
  }

  return (
    <div className="overview-container">
      {/* Top Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card portfolio-value">
          <div className="card-header">
            <h3>Portfolio Value</h3>
            <span className="card-icon">💰</span>
          </div>
          <div className="card-content">
            <div className="amount">${portfolioData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className={`change ${portfolioData.changePercent >= 0 ? 'positive' : 'negative'}`}>
              {portfolioData.changePercent >= 0 ? '📈' : '📉'} {portfolioData.changePercent}% (24h)
            </div>
          </div>
        </div>

        <div className="summary-card gain-loss">
          <div className="card-header">
            <h3>Total Gain/Loss</h3>
            <span className="card-icon">📊</span>
          </div>
          <div className="card-content">
            <div className={`amount ${portfolioData.gainLoss >= 0 ? 'gain' : 'loss'}`}>
              {portfolioData.gainLoss >= 0 ? '+' : ''} ${portfolioData.gainLoss.toFixed(2)}
            </div>
            <div className={`change ${portfolioData.gainLossPercent >= 0 ? 'positive' : 'negative'}`}>
              {portfolioData.gainLossPercent >= 0 ? '📈' : '📉'} {portfolioData.gainLossPercent}%
            </div>
          </div>
        </div>

        <div className="summary-card invested">
          <div className="card-header">
            <h3>Total Invested</h3>
            <span className="card-icon">💵</span>
          </div>
          <div className="card-content">
            <div className="amount">${portfolioData.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="subtext">{portfolioData.holdings.length} holdings</div>
          </div>
        </div>

        <div className="summary-card quick-stats">
          <div className="card-header">
            <h3>Quick Stats</h3>
            <span className="card-icon">⚡</span>
          </div>
          <div className="card-content stats-list">
            <div className="stat-item">
              <span className="stat-label">Assets</span>
              <span className="stat-value">{portfolioData.holdings.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Top Holding</span>
              <span className="stat-value">{portfolioData.topHolding ? portfolioData.topHolding.name : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="performance-section">
        <div className="section-header">
          <h2>📈 Performance Trend</h2>
          <span className="timeframe">Last 4 Weeks (28 Days)</span>
        </div>
        <div className="performance-chart">
          {portfolioData.performanceData && portfolioData.performanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={portfolioData.performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00d9ff" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
                <XAxis 
                  dataKey="time" 
                  stroke="#94a3b8" 
                  style={{ fontSize: '12px' }}
                  interval={Math.floor(portfolioData.performanceData.length / 5)}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Portfolio Value ($)', angle: -90, position: 'insideLeft', offset: 10 }}
                />
                <Tooltip 
                  contentStyle={{ background: '#1e293b', border: '1px solid #00d9ff', borderRadius: '8px' }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00d9ff" 
                  fill="url(#colorValue)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Holdings Breakdown */}
      {portfolioData.holdings.length > 0 ? (
        <div className="holdings-section">
          <div className="holdings-grid">
            {/* Pie Chart */}
            <div className="pie-chart-container">
              <div className="section-header">
                <h2>💎 Portfolio Allocation</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={portfolioData.holdings}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {portfolioData.holdings.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Holdings List */}
            <div className="holdings-list-container">
              <div className="section-header">
                <h2>🏆 Your Holdings</h2>
              </div>
              <div className="holdings-list">
                {portfolioData.holdings.map((holding, index) => (
                  <div key={index} className="holding-item">
                    <div className="holding-info">
                      <div className="holding-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <div className="holding-details">
                        <div className="holding-name">{holding.name}</div>
                        <div className="holding-quantity">{holding.quantity} units</div>
                      </div>
                    </div>
                    <div className="holding-value">
                      <div className="value">${holding.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="percentage">{((holding.value / portfolioData.totalValue) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🚀</div>
          <h2>No Holdings Yet</h2>
          <p>Start building your crypto portfolio by going to the "Current Prices" tab to buy your first cryptocurrency!</p>
          <div className="empty-tips">
            <div className="tip">
              <span className="tip-icon">💡</span>
              <p>Diversify your portfolio across multiple assets</p>
            </div>
            <div className="tip">
              <span className="tip-icon">📊</span>
              <p>Monitor market trends and price changes</p>
            </div>
            <div className="tip">
              <span className="tip-icon">🎯</span>
              <p>Set investment goals and track progress</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div 
            className="action-card"
            onClick={() => onNavigate && onNavigate('prices')}
          >
            <span className="action-icon">💹</span>
            <h3>View Prices</h3>
            <p>Check live crypto prices</p>
          </div>
          <div 
            className="action-card"
            onClick={() => onNavigate && onNavigate('movers')}
          >
            <span className="action-icon">🏆</span>
            <h3>Top Movers</h3>
            <p>See best & worst performers</p>
          </div>
          <div 
            className="action-card"
            onClick={() => onNavigate && onNavigate('portfolio')}
          >
            <span className="action-icon">💰</span>
            <h3>Manage Holdings</h3>
            <p>Edit your portfolio</p>
          </div>
        </div>
      </div>
    </div>
  );
}