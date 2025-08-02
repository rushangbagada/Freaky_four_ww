import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  
  return {
    plugins: [react()],
    base: '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isDev, // Only generate sourcemaps in development
      minify: isDev ? false : 'esbuild', // Better minification in production
      target: 'es2015', // Better browser support
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            admin: [
              './components/admin/Dashboard',
              './components/admin/UserManagement',
              './components/admin/ClubManagement',
              './components/admin/MatchManagement',
              './components/admin/Analytics'
            ]
          },
          // Optimize chunk naming for caching
          chunkFileNames: isDev ? '[name].js' : '[name].[hash].js',
          entryFileNames: isDev ? '[name].js' : '[name].[hash].js',
          assetFileNames: isDev ? '[name].[ext]' : '[name].[hash].[ext]'
        }
      },
      // Production optimizations
      cssCodeSplit: true,
      reportCompressedSize: false, // Faster builds
      chunkSizeWarningLimit: 600 // Adjusted for admin chunks
    },
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
    },
    // Performance optimizations
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      exclude: []
    }
  }
})
