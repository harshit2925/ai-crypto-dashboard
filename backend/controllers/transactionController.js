const Holding = require('../models/Holding');

// Get all transactions for a user
exports.getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const holdings = await Holding.find({ userId });

    const allTransactions = [];

    holdings.forEach(holding => {
      // Track cost basis as we go through transactions chronologically
      let cumulativeCost = 0;
      let cumulativeQuantity = 0;

      holding.transactions.forEach(transaction => {
        let profitLoss = 0;
        let profitLossPercent = 0;

        if (transaction.type === 'buy') {
          // BUY: Add to cost basis, show unrealized P&L vs current price
          cumulativeCost += transaction.total;
          cumulativeQuantity += transaction.quantity;
          
          profitLoss = (holding.price - transaction.price) * transaction.quantity;
          profitLossPercent = transaction.price > 0 ? ((holding.price - transaction.price) / transaction.price) * 100 : 0;
        } else if (transaction.type === 'sell') {
          // SELL: Calculate realized P&L based on cost basis at time of sale
          let avgCostPerUnit = 0;
          if (cumulativeQuantity > 0) {
            avgCostPerUnit = cumulativeCost / cumulativeQuantity;
          }
          
          // Realized P&L = (Sell Price - Average Cost) × Quantity Sold
          profitLoss = (transaction.price - avgCostPerUnit) * transaction.quantity;
          profitLossPercent = avgCostPerUnit > 0 ? ((transaction.price - avgCostPerUnit) / avgCostPerUnit) * 100 : 0;
          
          // Update cumulative after sell
          cumulativeQuantity -= transaction.quantity;
          cumulativeCost -= avgCostPerUnit * transaction.quantity;
        }

        allTransactions.push({
          symbol: holding.symbol,
          name: holding.name,
          type: transaction.type,
          quantity: transaction.quantity || 0,
          price: transaction.price || 0,
          total: transaction.total || 0,
          date: transaction.date,
          currentPrice: holding.price || 0,
          profitLoss: parseFloat(profitLoss.toFixed(2)),
          profitLossPercent: parseFloat(profitLossPercent.toFixed(2)),
        });
      });
    });

    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log('✅ Transactions calculated:', allTransactions.length);

    res.json({
      success: true,
      data: allTransactions,
      total: allTransactions.length,
    });
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message,
    });
  }
};

// Get transactions by symbol
exports.getTransactionsBySymbol = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symbol } = req.params;

    const holding = await Holding.findOne({ userId, symbol });

    if (!holding) {
      return res.status(404).json({
        success: false,
        message: `No transactions found for ${symbol}`,
      });
    }

    const transactionsWithPnL = [];
    let cumulativeCost = 0;
    let cumulativeQuantity = 0;

    holding.transactions.forEach(transaction => {
      let profitLoss = 0;
      let profitLossPercent = 0;

      if (transaction.type === 'buy') {
        // BUY: Add to cost basis, show unrealized P&L vs current price
        cumulativeCost += transaction.total;
        cumulativeQuantity += transaction.quantity;
        
        profitLoss = (holding.price - transaction.price) * transaction.quantity;
        profitLossPercent = transaction.price > 0 ? ((holding.price - transaction.price) / transaction.price) * 100 : 0;
      } else if (transaction.type === 'sell') {
        // SELL: Calculate realized P&L based on cost basis at time of sale
        let avgCostPerUnit = 0;
        if (cumulativeQuantity > 0) {
          avgCostPerUnit = cumulativeCost / cumulativeQuantity;
        }
        
        // Realized P&L = (Sell Price - Average Cost) × Quantity Sold
        profitLoss = (transaction.price - avgCostPerUnit) * transaction.quantity;
        profitLossPercent = avgCostPerUnit > 0 ? ((transaction.price - avgCostPerUnit) / avgCostPerUnit) * 100 : 0;
        
        // Update cumulative after sell
        cumulativeQuantity -= transaction.quantity;
        cumulativeCost -= avgCostPerUnit * transaction.quantity;
      }

      transactionsWithPnL.push({
        symbol: holding.symbol,
        name: holding.name,
        type: transaction.type,
        quantity: transaction.quantity || 0,
        price: transaction.price || 0,
        total: transaction.total || 0,
        date: transaction.date,
        currentPrice: holding.price,
        profitLoss: parseFloat(profitLoss.toFixed(2)),
        profitLossPercent: parseFloat(profitLossPercent.toFixed(2)),
      });
    });

    // Sort by date (newest first)
    transactionsWithPnL.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: transactionsWithPnL,
      total: transactionsWithPnL.length,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message,
    });
  }
};