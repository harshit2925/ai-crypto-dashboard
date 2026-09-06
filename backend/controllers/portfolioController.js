const Holding = require('../models/Holding');

// Get all holdings for a user
exports.getHoldings = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    // Get holdings with quantity > 0 (active holdings)
    const holdings = await Holding.find({ userId, quantity: { $gt: 0 } })
      .sort({ lastUpdated: -1 });

    res.json({
      success: true,
      data: holdings,
    });
  } catch (error) {
    console.error('Error fetching holdings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching holdings',
      error: error.message,
    });
  }
};

// Buy crypto (add to existing or create new)
exports.buyCrypto = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symbol, name, quantity, price } = req.body;

    // Validate input
    if (!symbol || !name || quantity <= 0 || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input parameters',
      });
    }

    const total = quantity * price;

    // Check if user already holds this crypto
    let holding = await Holding.findOne({ userId, symbol });

    if (holding) {
      // Update existing holding
      const oldTotal = holding.totalCost;
      const oldQuantity = holding.quantity;

      holding.quantity += quantity;
      holding.totalCost += total;
      holding.price = price; // Update to latest price
      holding.lastUpdated = new Date();

      // Add transaction record
      holding.transactions.push({
        type: 'buy',
        quantity,
        price,
        total,
        date: new Date(),
      });

      await holding.save();

      res.json({
        success: true,
        message: `Added ${quantity} ${symbol} to your holdings`,
        data: holding,
      });
    } else {
      // Create new holding
      holding = new Holding({
        userId,
        symbol,
        name,
        quantity,
        price,
        totalCost: total,
        transactions: [
          {
            type: 'buy',
            quantity,
            price,
            total,
            date: new Date(),
          },
        ],
      });

      await holding.save();

      res.json({
        success: true,
        message: `Purchased ${quantity} ${symbol}`,
        data: holding,
      });
    }
  } catch (error) {
    console.error('Error buying crypto:', error);
    res.status(500).json({
      success: false,
      message: 'Error buying crypto',
      error: error.message,
    });
  }
};

// Sell crypto (reduce quantity)
exports.sellCrypto = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symbol, quantity, price } = req.body;

    // Validate input
    if (!symbol || quantity <= 0 || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input parameters',
      });
    }

    // Find holding
    let holding = await Holding.findOne({ userId, symbol });

    if (!holding) {
      return res.status(404).json({
        success: false,
        message: `You don't own any ${symbol}`,
      });
    }

    // Check if selling more than owned
    if (quantity > holding.quantity) {
      return res.status(400).json({
        success: false,
        message: `You only own ${holding.quantity} ${symbol}`,
      });
    }

    const total = quantity * price;

    // Update holding
    holding.quantity -= quantity;
    holding.price = price; // Update to latest price
    holding.lastUpdated = new Date();

    // Add transaction record (SELL transaction)
    holding.transactions.push({
      type: 'sell',
      quantity,
      price,
      total,
      date: new Date(),
    });

    console.log(`📤 Sell Transaction Added:`, {
      symbol,
      type: 'sell',
      quantity,
      price,
      total,
      date: new Date(),
    });

    // IMPORTANT: DO NOT DELETE - Keep holding with 0 quantity to preserve transaction history
    await holding.save();

    res.json({
      success: true,
      message: `Sold ${quantity} ${symbol}`,
      data: holding,
    });
  } catch (error) {
    console.error('Error selling crypto:', error);
    res.status(500).json({
      success: false,
      message: 'Error selling crypto',
      error: error.message,
    });
  }
};

// Get single holding details
exports.getHoldingDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symbol } = req.params;

    const holding = await Holding.findOne({ userId, symbol });

    if (!holding) {
      return res.status(404).json({
        success: false,
        message: `No holding found for ${symbol}`,
      });
    }

    res.json({
      success: true,
      data: holding,
    });
  } catch (error) {
    console.error('Error fetching holding details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching holding details',
      error: error.message,
    });
  }
};

// Get transaction history for a holding
exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symbol } = req.params;

    const holding = await Holding.findOne({ userId, symbol });

    if (!holding) {
      return res.status(404).json({
        success: false,
        message: `No holding found for ${symbol}`,
      });
    }

    res.json({
      success: true,
      data: holding.transactions,
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction history',
      error: error.message,
    });
  }
};

// Get portfolio summary
exports.getPortfolioSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Only get holdings with quantity > 0 (active positions)
    const holdings = await Holding.find({ userId, quantity: { $gt: 0 } });

    const summary = {
      totalValue: 0,
      totalInvested: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      holdings: holdings.length,
      cryptos: holdings,
    };

    holdings.forEach(h => {
      summary.totalValue += h.quantity * h.price;
      summary.totalInvested += h.totalCost;
    });

    summary.totalGainLoss = summary.totalValue - summary.totalInvested;
    summary.totalGainLossPercent = summary.totalInvested > 0 
      ? ((summary.totalGainLoss / summary.totalInvested) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error calculating portfolio summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating portfolio summary',
      error: error.message,
    });
  }
};