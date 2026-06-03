/// <reference types="vite/client" />
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' ,
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 15000,
})

// Attach JWT token to every outgoing request
api.interceptors.request.use((config) => {
  // Import lazily to avoid circular dependency
  const token = localStorage.getItem('accessToken')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('auth')

      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default api
