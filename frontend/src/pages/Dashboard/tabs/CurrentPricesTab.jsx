import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BuySellModal from '../components/BuySellModal';
import './CurrentPricesTab.css';

export default function CurrentPricesTab() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('buy');

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&sparkline=true&price_change_percentage=24h'
      );
      const data = await response.json();

      const formattedData = data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price || 0,
        change24h: coin.price_change_percentage_24h || 0,
        marketCap: coin.market_cap || 0,
        image: coin.image,
        sparkline: coin.sparkline_in_7d?.price || [],
      }));

      setCryptos(formattedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      setLoading(false);
    }
  };

  const handleBuyClick = (crypto) => {
    setSelectedCrypto(crypto);
    setModalMode('buy');
    setModalOpen(true);
  };

  const handleSellClick = (crypto) => {
    setSelectedCrypto(crypto);
    setModalMode('sell');
    setModalOpen(true);
  };

  const getHoldingAmount = (symbol) => {
    const holdings = JSON.parse(localStorage.getItem('holdings') || '[]');
    const holding = holdings.find(h => h.symbol.toUpperCase() === symbol);
    return holding ? holding.quantity : 0;
  };

  // Format sparkline data - use all 7 days of hourly data
  const formatChartData = (sparkline) => {
    if (!sparkline || sparkline.length === 0) return [];
    
    // Use all sparkline data (7 days of hourly data)
    const now = new Date();
    const dataPoints = sparkline.map((price, index) => {
      // Calculate hours back from now
      const hoursBack = sparkline.length - index - 1;
      const date = new Date(now);
      date.setHours(date.getHours() - hoursBack);
      
      return {
        price: price || 0,
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        displayTime: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        fullDate: date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false
        }),
        index: index,
      };
    });
    
    return dataPoints;
  };

  // Calculate nice Y-axis ticks based on price range
  const generateNiceTicks = (data) => {
    if (!data || data.length === 0) return [0, 100, 200];

    const prices = data.map(d => d.price).filter(p => p > 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;

    let interval = 50;
    if (range > 10000) interval = 2000;
    else if (range > 5000) interval = 1000;
    else if (range > 1000) interval = 200;
    else if (range > 500) interval = 100;
    else if (range > 100) interval = 20;
    else if (range > 50) interval = 10;
    else interval = 5;

    const bottomTick = Math.floor(minPrice / interval) * interval;
    const topTick = Math.ceil(maxPrice / interval) * interval;

    const ticks = [];
    for (let i = bottomTick; i <= topTick; i += interval) {
      ticks.push(i);
    }

    return ticks;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-date">{data.displayDate} {data.displayTime}</p>
          <p className="tooltip-price">${data.price.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="loading">Loading crypto prices...</div>;
  }

  if (cryptos.length === 0) {
    return <div className="loading">No crypto data available. Please try refreshing.</div>;
  }

  return (
    <div className="current-prices-container">
      <div className="prices-header">
        <h2>💹 Live Crypto Prices</h2>
        <button className="refresh-btn" onClick={fetchCryptoData}>🔄 Refresh</button>
      </div>

      <div className="cryptos-list">
        {cryptos.map(crypto => {
          const holdingAmount = getHoldingAmount(crypto.symbol);
          const holdingValue = holdingAmount * crypto.price;
          const chartData = formatChartData(crypto.sparkline);
          const yAxisTicks = generateNiceTicks(chartData);

          return (
            <div key={crypto.id} className="crypto-card">
              {/* Header */}
              <div className="crypto-header">
                <div className="crypto-info">
                  <img src={crypto.image} alt={crypto.name} className="crypto-icon" />
                  <div className="crypto-name">
                    <h3>{crypto.name}</h3>
                    <span className="symbol">{crypto.symbol}</span>
                  </div>
                </div>
                <div className="crypto-price">
                  <span className="price">${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className={`change ${(crypto.change24h || 0) >= 0 ? 'positive' : 'negative'}`}>
                    {(crypto.change24h || 0) >= 0 ? '📈' : '📉'} {((crypto.change24h || 0)).toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Chart with Labels */}
              <div className="crypto-chart-section">
                <div className="chart-label">7-Day Price Chart</div>
                <div className="crypto-chart">
                  {chartData && chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart 
                        data={chartData} 
                        margin={{ top: 20, right: 30, left: 50, bottom: 50 }}
                      >
                        <defs>
                          <linearGradient id={`gradient-${crypto.symbol}`} x1="0" y1="0" x2="0" y2="1">
                            <stop 
                              offset="5%" 
                              stopColor={(crypto.change24h || 0) >= 0 ? '#00ff00' : '#ff0000'} 
                              stopOpacity={0.8}
                            />
                            <stop 
                              offset="95%" 
                              stopColor={(crypto.change24h || 0) >= 0 ? '#00ff00' : '#ff0000'} 
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        
                        {/* Grid */}
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke="rgba(0, 217, 255, 0.15)" 
                          horizontal={true}
                          vertical={false}
                        />
                        
                        {/* X Axis - Dates */}
                        <XAxis 
                          dataKey="displayDate" 
                          stroke="#94a3b8"
                          style={{ fontSize: '12px' }}
                          tick={{ fill: '#94a3b8', fontSize: 11 }}
                          interval={Math.max(1, Math.floor(chartData.length / 4))}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        
                        {/* Y Axis - Price with Clean Values */}
                        <YAxis 
                          stroke="#94a3b8"
                          style={{ fontSize: '12px' }}
                          ticks={yAxisTicks}
                          tick={{ fill: '#94a3b8', fontSize: 11 }}
                          label={{ 
                            value: 'Price (USD)', 
                            angle: -90, 
                            position: 'left',
                            offset: 10,
                            fill: '#94a3b8', 
                            fontSize: 12,
                            fontWeight: 600
                          }}
                          type="number"
                          domain={[Math.min(...yAxisTicks), Math.max(...yAxisTicks)]}
                          width={50}
                        />
                        
                        {/* Tooltip - Shows on hover */}
                        <Tooltip 
                          content={<CustomTooltip />}
                          cursor={{ strokeDasharray: '3 3', stroke: 'rgba(0, 217, 255, 0.5)', strokeWidth: 2 }}
                        />
                        
                        {/* Legend */}
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                          contentStyle={{ color: '#94a3b8' }}
                        />
                        
                        {/* Line */}
                        <Line 
                          type="natural" 
                          dataKey="price" 
                          name={`${crypto.symbol} Price`}
                          stroke={(crypto.change24h || 0) >= 0 ? '#00ff00' : '#ff0000'} 
                          strokeWidth={3}
                          dot={false}
                          isAnimationActive={true}
                          fill={`url(#gradient-${crypto.symbol})`}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 20px' }}>
                      Chart data unavailable
                    </div>
                  )}
                </div>
              </div>

              {/* Holdings & Actions */}
              <div className="crypto-footer">
                <div className="holdings">
                  <span className="label">You Hold:</span>
                  <span className="amount">
                    {holdingAmount > 0 ? (
                      <>
                        {holdingAmount} {crypto.symbol} <span className="value">(${holdingValue.toFixed(2)})</span>
                      </>
                    ) : (
                      <span className="no-holding">None</span>
                    )}
                  </span>
                </div>
                <div className="actions">
                  <button 
                    className="btn-buy" 
                    onClick={() => handleBuyClick(crypto)}
                  >
                    Buy {crypto.symbol}
                  </button>
                  <button 
                    className="btn-sell" 
                    onClick={() => handleSellClick(crypto)}
                    disabled={holdingAmount === 0}
                  >
                    Sell {crypto.symbol}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Buy/Sell Modal */}
      {modalOpen && selectedCrypto && (
        <BuySellModal
          crypto={selectedCrypto}
          mode={modalMode}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}