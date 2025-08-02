import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  
  return {
    plugins: [react()],
    server: {
      proxy: isDev ? {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true
        }
      } : undefined
    },
    define: {
      // Make sure environment variables are available at build time
      'process.env.VITE_APP_API_URL': JSON.stringify(process.env.VITE_APP_API_URL || 'https://freaky-four.onrender.com')
    }
  }
})
