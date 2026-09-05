import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const portfolioAPI = axios.create({
  baseURL: `${API_URL}/portfolio`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
portfolioAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all holdings
export const getHoldings = async () => {
  try {
    const response = await portfolioAPI.get('/holdings');
    return response.data;
  } catch (error) {
    console.error('Error fetching holdings:', error);
    throw error;
  }
};

// Get portfolio summary
export const getPortfolioSummary = async () => {
  try {
    const response = await portfolioAPI.get('/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    throw error;
  }
};

// Buy crypto
export const buyCrypto = async (symbol, name, quantity, price) => {
  try {
    const response = await portfolioAPI.post('/buy', {
      symbol,
      name,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
    });
    return response.data;
  } catch (error) {
    console.error('Error buying crypto:', error);
    throw error.response?.data || error;
  }
};

// Sell crypto
export const sellCrypto = async (symbol, quantity, price) => {
  try {
    const response = await portfolioAPI.post('/sell', {
      symbol,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
    });
    return response.data;
  } catch (error) {
    console.error('Error selling crypto:', error);
    throw error.response?.data || error;
  }
};

// Get single holding details
export const getHoldingDetails = async (symbol) => {
  try {
    const response = await portfolioAPI.get(`/holdings/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching holding details:', error);
    throw error;
  }
};

// Get transaction history
export const getTransactionHistory = async (symbol) => {
  try {
    const response = await portfolioAPI.get(`/transactions/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
};

export default portfolioAPI;