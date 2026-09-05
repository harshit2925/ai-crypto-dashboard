import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const chatAPI = axios.create({
  baseURL: `${API_URL}/chat`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
chatAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Send message to Groq AI
export const sendChatMessage = async (message) => {
  try {
    const response = await chatAPI.post('/ask', {
      message,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error.response?.data || error;
  }
};

export default chatAPI;