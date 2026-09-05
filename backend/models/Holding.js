const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  boughtAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ['buy', 'sell'],
      },
      quantity: Number,
      price: Number,
      total: Number,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Ensure unique combination of userId and symbol
HoldingSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Holding', HoldingSchema);