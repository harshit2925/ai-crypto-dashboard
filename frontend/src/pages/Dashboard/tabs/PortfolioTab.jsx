import React, { useState, useEffect } from 'react';
import BuySellModal from '../components/BuySellModal';
import * as portfolioService from '../../../services/portfolioService';
import './PortfolioTab.css';

export default function PortfolioTab() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('buy');

  useEffect(() => {
    loadHoldings();
  }, []);

  const loadHoldings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await portfolioService.getHoldings();
      
      if (response.success && response.data) {
        setHoldings(response.data);
        console.log('✅ Holdings loaded:', response.data.length);
      }
    } catch (err) {
      console.error('Error loading holdings:', err);
      setError('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = (holding) => {
    setSelectedCrypto({
      symbol: holding.symbol,
      name: holding.name,
      price: holding.price,
      image: holding.image,
    });
    setModalMode('buy');
    setModalOpen(true);
  };

  const handleSellClick = (holding) => {
    setSelectedCrypto({
      symbol: holding.symbol,
      name: holding.name,
      price: holding.price,
      image: holding.image,
    });
    setModalMode('sell');
    setModalOpen(true);
  };

  const handleSaveTransaction = async (updatedCrypto) => {
    try {
      setError(null);

      if (modalMode === 'buy') {
        await portfolioService.buyCrypto(
          updatedCrypto.symbol,
          updatedCrypto.name,
          updatedCrypto.quantity,
          updatedCrypto.price
        );
      } else if (modalMode === 'sell') {
        await portfolioService.sellCrypto(
          updatedCrypto.symbol,
          updatedCrypto.quantity,
          updatedCrypto.price
        );
      }

      setModalOpen(false);
      await loadHoldings();
    } catch (err) {
      console.error('Error saving transaction:', err);
      setError(err.message || 'Error saving transaction');
    }
  };

  if (loading) {
    return <div className="portfolio-loading">Loading your portfolio...</div>;
  }

  if (holdings.length === 0) {
    return (
      <div className="portfolio-empty">
        <div className="empty-icon">💼</div>
        <h2>No Holdings Yet</h2>
        <p>Go to Current Prices tab to buy your first crypto!</p>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <div className="update-info">
        💰 Your Portfolio - Prices loaded from MongoDB
      </div>

      <div className="portfolio-table-container">
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Coin</th>
              <th>Quantity</th>
              <th>Price Bought</th>
              <th>Total Cost</th>
              <th>Price Now</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, index) => {
              const priceBought = holding.totalCost / holding.quantity;
              const totalCost = holding.quantity * priceBought;

              return (
                <tr key={index} className="portfolio-row">
                  <td className="coin-cell">
                    <strong>{holding.symbol}</strong>
                    <span className="coin-name">{holding.name}</span>
                  </td>
                  <td className="qty-cell">
                    {holding.quantity}
                  </td>
                  <td className="bought-price-cell">
                    ${priceBought.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="total-cost-cell">
                    ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="current-price-cell">
                    ${holding.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="btn-buy"
                      onClick={() => handleBuyClick(holding)}
                    >
                      Buy
                    </button>
                    <button 
                      className="btn-sell"
                      onClick={() => handleSellClick(holding)}
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedCrypto && (
        <BuySellModal
          crypto={selectedCrypto}
          mode={modalMode}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveTransaction}
          onSuccess={() => setModalOpen(false)}
          currentHolding={holdings.find(h => h.symbol === selectedCrypto.symbol)?.quantity || 0}
        />
      )}
    </div>
  );
}