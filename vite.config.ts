import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Bind IPv4 explicitly. The default ('localhost') resolves to ::1 only on
    // macOS, which leaves http://127.0.0.1:3000 refusing connections.
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // The browser attaches the dev server's own Origin to proxied requests.
        // The backend's cors.allowed-origins only lists http://localhost:3000,
        // so any other dev port (Vite auto-increments when 3000 is taken) gets
        // a plain-text "Invalid CORS request" 403 that breaks response.json().
        // Presenting the target's own origin makes it a same-origin request,
        // which skips the CORS check entirely and works on any dev port.
        headers: {
          Origin: 'http://localhost:8080',
        },
      },
    },
  },
})
