import React, { useState, useEffect } from 'react';
import BuySellModal from '../components/BuySellModal';
import './PortfolioTab.css';

export default function PortfolioTab() {
  const [holdings, setHoldings] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [action, setAction] = useState(null);

  useEffect(() => {
    loadHoldings();
  }, []);

  const loadHoldings = () => {
    const data = JSON.parse(localStorage.getItem('holdings') || '[]');
    setHoldings(data);
  };

  const handleBuy = (crypto) => {
    setSelectedCrypto(crypto);
    setAction('buy');
  };

  const handleSell = (crypto) => {
    setSelectedCrypto(crypto);
    setAction('sell');
  };

  const handleSaveTransaction = (updatedCrypto) => {
    if (updatedCrypto.quantity === 0) {
      // Remove if quantity is 0
      const updated = holdings.filter(h => h.symbol !== updatedCrypto.symbol);
      setHoldings(updated);
      localStorage.setItem('holdings', JSON.stringify(updated));
    } else {
      // Update existing or add new
      const existingIndex = holdings.findIndex(h => h.symbol === updatedCrypto.symbol);
      let updated;
      if (existingIndex >= 0) {
        updated = [...holdings];
        updated[existingIndex] = updatedCrypto;
      } else {
        updated = [...holdings, updatedCrypto];
      }
      setHoldings(updated);
      localStorage.setItem('holdings', JSON.stringify(updated));
    }
    setSelectedCrypto(null);
    setAction(null);
  };

  const getTotalValue = () => {
    return holdings.reduce((sum, h) => sum + (h.quantity * h.price), 0);
  };

  const getTotalInvested = () => {
    return holdings.reduce((sum, h) => sum + h.totalCost, 0);
  };

  const getTotalGainLoss = () => {
    return getTotalValue() - getTotalInvested();
  };

  return (
    <div className="portfolio-container">
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