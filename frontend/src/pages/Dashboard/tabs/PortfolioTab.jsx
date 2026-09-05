import React, { useState, useEffect } from 'react';
import BuySellModal from '../components/BuySellModal';
import * as portfolioService from '../../../services/portfolioService';
import './PortfolioTab.css';

export default function PortfolioTab() {
  const [holdings, setHoldings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load from backend first
      try {
        const holdingsResponse = await portfolioService.getHoldings();
        if (holdingsResponse.success) {
          setHoldings(holdingsResponse.data);
        }

        const summaryResponse = await portfolioService.getPortfolioSummary();
        if (summaryResponse.success) {
          setSummary(summaryResponse.data);
        }
      } catch (apiError) {
        console.warn('Backend not available, falling back to localStorage');
        // Fallback to localStorage if backend is down
        const data = JSON.parse(localStorage.getItem('holdings') || '[]');
        setHoldings(data);
      }
    } catch (err) {
      console.error('Error loading portfolio:', err);
      setError('Error loading portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = (crypto) => {
    setSelectedCrypto(crypto);
    setAction('buy');
  };

  const handleSell = (crypto) => {
    setSelectedCrypto(crypto);
    setAction('sell');
  };

  const handleSaveTransaction = async (updatedCrypto) => {
    try {
      setError(null);

      if (action === 'buy') {
        const response = await portfolioService.buyCrypto(
          updatedCrypto.symbol,
          updatedCrypto.name,
          updatedCrypto.quantity,
          updatedCrypto.price
        );

        if (response.success) {
          console.log('✅ Buy successful:', response.message);
          // Reload data from backend
          await loadPortfolioData();
        }
      } else if (action === 'sell') {
        const response = await portfolioService.sellCrypto(
          updatedCrypto.symbol,
          updatedCrypto.quantity,
          updatedCrypto.price
        );

        if (response.success) {
          console.log('✅ Sell successful:', response.message);
          // Reload data from backend
          await loadPortfolioData();
        }
      }

      setSelectedCrypto(null);
      setAction(null);
    } catch (err) {
      console.error('Error saving transaction:', err);
      setError(err.message || 'Error saving transaction');
    }
  };

  const getTotalValue = () => {
    return summary?.totalValue || 0;
  };

  const getTotalInvested = () => {
    return summary?.totalInvested || 0;
  };

  const getTotalGainLoss = () => {
    return summary?.totalGainLoss || 0;
  };

  if (loading) {
    return (
      <div className="portfolio-container">
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          Loading portfolio data...
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      {/* Error Message */}
      {error && (
        <div style={{
          background: 'rgba(255, 107, 107, 0.2)',
          border: '1px solid #ff6b6b',
          color: '#ff6b6b',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Portfolio Summary */}
      <div className="portfolio-summary">
        <div className="summary-item">
          <span className="label">Total Value</span>
          <span className="value">${getTotalValue().toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="label">Total Invested</span>
          <span className="value">${getTotalInvested().toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className={`label gain-loss ${getTotalGainLoss() >= 0 ? 'gain' : 'loss'}`}>
            Total Gain/Loss
          </span>
          <span className={`value ${getTotalGainLoss() >= 0 ? 'gain' : 'loss'}`}>
            {getTotalGainLoss() >= 0 ? '+' : ''} ${getTotalGainLoss().toFixed(2)}
          </span>
        </div>
      </div>

      {/* Holdings Table */}
      {holdings.length > 0 ? (
        <div className="table-container">
          <table className="holdings-table">
            <thead>
              <tr>
                <th>CRYPTOCURRENCY</th>
                <th>SYMBOL</th>
                <th>PRICE</th>
                <th>QUANTITY</th>
                <th>VALUE</th>
                <th>COST</th>
                <th>GAIN/LOSS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding, index) => {
                const currentValue = holding.quantity * holding.price;
                const gainLoss = currentValue - holding.totalCost;
                const gainLossPercent = holding.totalCost > 0 ? ((gainLoss / holding.totalCost) * 100).toFixed(2) : 0;

                return (
                  <tr key={index} className="holding-row">
                    <td className="crypto-cell">
                      <div className="crypto-info">
                        <span className="crypto-icon">{holding.symbol.charAt(0)}</span>
                        <div className="crypto-name-wrapper">
                          <span className="crypto-name">{holding.name}</span>
                          <span className="crypto-symbol">{holding.symbol}</span>
                        </div>
                      </div>
                    </td>
                    <td className="center-cell">{holding.symbol.toUpperCase()}</td>
                    <td className="right-cell">${holding.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="right-cell">{holding.quantity}</td>
                    <td className="right-cell highlight">
                      ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="right-cell">${holding.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className={`right-cell ${gainLoss >= 0 ? 'gain' : 'loss'}`}>
                      {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)}
                      <span className="percent"> ({gainLossPercent}%)</span>
                    </td>
                    <td className="actions-cell">
                      <button className="btn-buy" onClick={() => handleBuy(holding)}>
                        Buy
                      </button>
                      <button className="btn-sell" onClick={() => handleSell(holding)}>
                        Sell
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>No Holdings</h2>
          <p>You haven't added any holdings yet. Go to the Current Prices tab to buy your first cryptocurrency!</p>
        </div>
      )}

      {/* Buy/Sell Modal */}
      {selectedCrypto && action && (
        <BuySellModal
          crypto={selectedCrypto}
          action={action}
          onClose={() => {
            setSelectedCrypto(null);
            setAction(null);
          }}
          onSave={handleSaveTransaction}
        />
      )}
    </div>
  );
}