const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const transactionController = require('../controllers/transactionController');

// Auth middleware - verify JWT token and extract user ID
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    // Verify token using JWT_SECRET from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user on request object
    req.user = { id: decoded.id };
    
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

// Apply auth to all routes
router.use(authMiddleware);

// Get all transactions
router.get('/all', transactionController.getAllTransactions);

// Get transactions by symbol
router.get('/:symbol', transactionController.getTransactionsBySymbol);

module.exports = router;