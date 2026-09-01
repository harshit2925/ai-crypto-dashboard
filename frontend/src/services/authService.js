import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  signup: async (name, email, password, confirmPassword) => {
    const response = await axios.post(`${API_URL}/signup`, {
      name,
      email,
      password,
      confirmPassword,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  forgotPassword: async (email) => {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  },

  resetPassword: async (resetToken, newPassword, confirmPassword) => {
    const response = await axios.post(`${API_URL}/reset-password`, {
      resetToken,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  getProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateProfile: async (name, bio, avatar) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/profile`,
      { name, bio, avatar },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default authService;