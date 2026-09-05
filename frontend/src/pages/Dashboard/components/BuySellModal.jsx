import React, { useState } from 'react';
import './BuySellModal.css';


export default function BuySellModal({ crypto, mode, onClose, onSuccess, onSave }) {
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const totalCost = quantity ? (parseFloat(quantity) * crypto.price).toFixed(2) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!quantity || quantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    setLoading(true);

    try {
      // Call onSave to send to backend API (MongoDB)
      if (onSave) {
        console.log(`Calling onSave for ${mode}:`, { symbol: crypto.symbol, quantity, price: crypto.price });
        await onSave({
          symbol: crypto.symbol,
          name: crypto.name,
          quantity: parseFloat(quantity),
          price: crypto.price,
        });
        console.log('✅ Transaction saved to backend!');
      } else {
        // Fallback: Save to localStorage if onSave not provided
        console.log('⚠️ No onSave provided, falling back to localStorage');
        const holdings = JSON.parse(localStorage.getItem('holdings') || '[]');
        const existingIndex = holdings.findIndex(h => h.symbol.toUpperCase() === crypto.symbol);

        if (mode === 'buy') {
          if (existingIndex >= 0) {
            holdings[existingIndex].quantity += parseFloat(quantity);
            holdings[existingIndex].totalCost += parseFloat(totalCost);
          } else {
            holdings.push({
              symbol: crypto.symbol,
              name: crypto.name,
              quantity: parseFloat(quantity),
              price: crypto.price,
              totalCost: parseFloat(totalCost),
              boughtAt: new Date().toISOString(),
              image: crypto.image,
            });
          }
        } else if (mode === 'sell') {
          if (existingIndex >= 0) {
            const quantityToSell = parseFloat(quantity);
            if (holdings[existingIndex].quantity < quantityToSell) {
              setError('You don\'t have enough holdings to sell');
              setLoading(false);
              return;
            }
            holdings[existingIndex].quantity -= quantityToSell;
            holdings[existingIndex].totalCost -= parseFloat(totalCost);
            if (holdings[existingIndex].quantity <= 0) {
              holdings.splice(existingIndex, 1);
            }
          } else {
            setError('You don\'t own this cryptocurrency');
            setLoading(false);
            return;
          }
        }
        localStorage.setItem('holdings', JSON.stringify(holdings));
      }

      setSuccess(`✅ Successfully ${mode === 'buy' ? 'bought' : 'sold'} ${quantity} ${crypto.symbol}!`);
      setQuantity('');
      
      // Call success callback
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Transaction error:', err);
      setError('Error processing transaction: ' + (err.message || JSON.stringify(err)));
      setLoading(false);
    }
  };

  const currentHolding = (() => {
    const holdings = JSON.parse(localStorage.getItem('holdings') || '[]');
    const holding = holdings.find(h => h.symbol.toUpperCase() === crypto.symbol);
    return holding ? holding.quantity : 0;
  })();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <img src={crypto.image} alt={crypto.name} className="modal-icon" />
            <div>
              <h2>{mode === 'buy' ? 'Buy' : 'Sell'} {crypto.name}</h2>
              <p>{crypto.symbol} @ ${crypto.price}</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Quantity Input */}
          <div className="form-group">
            <label htmlFor="quantity">
              {mode === 'buy' ? 'Amount to Buy' : 'Amount to Sell'}
            </label>
            <input
              id="quantity"
              type="number"
              step="0.00000001"
              placeholder="0.00"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={loading}
              className="quantity-input"
            />
            <span className="unit">{crypto.symbol}</span>
          </div>

          {/* Current Holdings Info */}
          {mode === 'sell' && (
            <div className="holding-info">
              <p>You hold: <strong>{currentHolding} {crypto.symbol}</strong></p>
              <button 
                type="button"
                className="max-btn"
                onClick={() => setQuantity(currentHolding.toString())}
              >
                Use Max
              </button>
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="cost-breakdown">
            <div className="cost-row">
              <span className="label">Unit Price:</span>
              <span className="value">${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="cost-row">
              <span className="label">Quantity:</span>
              <span className="value">{quantity || '0'} {crypto.symbol}</span>
            </div>
            <div className="cost-row total">
              <span className="label">Total Cost:</span>
              <span className="value">${totalCost}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="modal-buttons">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`btn-submit ${mode}`}
              disabled={loading || !quantity}
            >
              {loading ? 'Processing...' : `Confirm ${mode === 'buy' ? 'Buy' : 'Sell'}`}
            </button>
          </div>

          {/* Warning */}
          <p className="modal-warning">
            ⚠️ This is a demo. Transactions are stored in MongoDB.
          </p>
        </form>
      </div>
    </div>
  );
}