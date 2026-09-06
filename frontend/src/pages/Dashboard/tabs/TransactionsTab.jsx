import React, { useState, useEffect } from 'react';
import * as transactionService from '../../../services/transactionService';
import './TransactionsTab.css';

export default function TransactionsTab() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [filterType, setFilterType] = useState('all');
  const [filterSymbol, setFilterSymbol] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filterType, filterSymbol, searchTerm]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionService.getAllTransactions();
      
      if (response.success) {
        // Calculate average cost basis in chronological order
        const transactionsWithAvgCost = calculateAverageCostBasis(response.data);
        setTransactions(transactionsWithAvgCost);
        console.log('✅ Transactions loaded:', response.data.length);
      }
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageCostBasis = (allTransactions) => {
    // Group by symbol and calculate chronologically
    const bySymbol = {};
    
    allTransactions.forEach(tx => {
      if (!bySymbol[tx.symbol]) {
        bySymbol[tx.symbol] = [];
      }
      bySymbol[tx.symbol].push(tx);
    });

    const result = [];
    
    Object.keys(bySymbol).forEach(symbol => {
      const symbolTransactions = bySymbol[symbol];
      
      // Sort chronologically (oldest first)
      const chronological = [...symbolTransactions].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );

      let totalCost = 0;
      let totalQuantity = 0;

      chronological.forEach(tx => {
        let unitCost = 0;

        if (tx.type === 'buy') {
          // For buy: unit cost is the buy price
          unitCost = tx.price;
          totalCost += tx.total;
          totalQuantity += tx.quantity;
        } else if (tx.type === 'sell') {
          // For sell: unit cost is average of all prior buys
          if (totalQuantity > 0) {
            unitCost = totalCost / totalQuantity;
          }
          // Update totals after sell
          totalQuantity -= tx.quantity;
          totalCost -= unitCost * tx.quantity;
        }

        tx.unitCost = parseFloat(unitCost.toFixed(2));
      });

      result.push(...chronological);
    });

    // Sort back to newest first for display
    result.sort((a, b) => new Date(b.date) - new Date(a.date));

    return result;
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    if (filterSymbol !== 'all') {
      filtered = filtered.filter(tx => tx.symbol === filterSymbol);
    }

    if (searchTerm) {
      filtered = filtered.filter(tx =>
        tx.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const uniqueSymbols = [...new Set(transactions.map(tx => tx.symbol))];

  const stats = {
    totalTransactions: transactions.length,
    totalBuys: transactions.filter(tx => tx.type === 'buy').length,
    totalSells: transactions.filter(tx => tx.type === 'sell').length,
    totalSpent: transactions
      .filter(tx => tx.type === 'buy')
      .reduce((sum, tx) => sum + (tx.total || 0), 0),
  };

  if (loading) {
    return <div className="transactions-loading">Loading transactions...</div>;
  }

  return (
    <div className="transactions-container">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <p className="stat-label">Total Transactions</p>
            <p className="stat-value">{stats.totalTransactions}</p>
          </div>
        </div>

        <div className="stat-card buy">
          <div className="stat-icon">💚</div>
          <div className="stat-content">
            <p className="stat-label">Total Buys</p>
            <p className="stat-value">{stats.totalBuys}</p>
            <p className="stat-amount">${stats.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="stat-card sell">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <p className="stat-label">Total Sells</p>
            <p className="stat-value">{stats.totalSells}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
            <option value="all">All</option>
            <option value="buy">Buy Only</option>
            <option value="sell">Sell Only</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Coin</label>
          <select value={filterSymbol} onChange={(e) => setFilterSymbol(e.target.value)} className="filter-select">
            <option value="all">All Coins</option>
            {uniqueSymbols.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <button className="reset-btn" onClick={() => {
          setFilterType('all');
          setFilterSymbol('all');
          setSearchTerm('');
        }}>
          Reset
        </button>
      </div>

      {/* Error */}
      {error && <div className="error-message">⚠️ {error}</div>}

      {/* Table */}
      {filteredTransactions.length > 0 ? (
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Coin</th>
                <th>Quantity</th>
                <th>Unit Cost</th>
                <th>Price</th>
                <th>Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, index) => {
                const costLabel = tx.type === 'buy' ? 'Buy Price' : 'Avg Cost';
                const priceLabel = tx.type === 'buy' ? 'Current' : 'Sold At';
                
                return (
                  <tr key={index} className={`transaction-row ${tx.type}`}>
                    <td className="date-cell">
                      {tx.date ? (
                        <>
                          {new Date(tx.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: '2-digit',
                          })}
                          <br />
                          <span className="time">
                            {new Date(tx.date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </span>
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="type-cell">
                      <span className={`type-badge ${tx.type}`}>
                        {tx.type === 'buy' ? '🟢 BUY' : '🔴 SELL'}
                      </span>
                    </td>
                    <td className="coin-cell">
                      <strong>{tx.symbol}</strong>
                      <span className="coin-name">{tx.name}</span>
                    </td>
                    <td className="qty-cell">
                      {tx.quantity}
                    </td>
                    <td className="cost-cell">
                      <strong>${(tx.unitCost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                      <span className="label">{costLabel}</span>
                    </td>
                    <td className="price-cell">
                      <strong>${(tx.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                      <span className="label">{priceLabel}</span>
                    </td>
                    <td className={`pnl-cell ${tx.profitLoss >= 0 ? 'positive' : 'negative'}`}>
                      <strong>
                        {tx.profitLoss >= 0 ? '✅' : '❌'} 
                        ${Math.abs(tx.profitLoss || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                      <span className="percent">
                        {tx.profitLossPercent >= 0 ? '📈' : '📉'} {(tx.profitLossPercent || 0).toFixed(2)}%
                      </span>
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
          <h2>No Transactions</h2>
          <p>{transactions.length === 0 ? 'Start trading to see history' : 'No matches for filters'}</p>
        </div>
      )}

      <div className="results-footer">
        {filteredTransactions.length} of {transactions.length} transactions
      </div>
    </div>
  );
}