import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const transactionAPI = axios.create({
  baseURL: `${API_URL}/transactions`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
transactionAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all transactions
export const getAllTransactions = async () => {
  try {
    const response = await transactionAPI.get('/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error.response?.data || error;
  }
};

// Get transactions by coin
export const getTransactionsBySymbol = async (symbol) => {
  try {
    const response = await transactionAPI.get(`/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error.response?.data || error;
  }
};

export default transactionAPI;