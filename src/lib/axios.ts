/// <reference types="vite/client" />
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach JWT token to every outgoing request
api.interceptors.request.use((config) => {
  // Import lazily to avoid circular dependency
  const raw = localStorage.getItem('crm-auth')
  if (raw) {
    try {
      const state = JSON.parse(raw)
      const token = state?.state?.token
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch {
      // ignore malformed storage
    }
  }
  return config
})

// Handle 401 — clear session and redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('crm-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
