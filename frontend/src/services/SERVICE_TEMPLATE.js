// Example API service
// Location: services/apiService.js

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Example API call
export const fetchCryptoData = async () => {
  try {
    const response = await api.get('/crypto')
    return response.data
  } catch (error) {
    console.error('Error fetching crypto data:', error)
    throw error
  }
}

// Add more API calls here
