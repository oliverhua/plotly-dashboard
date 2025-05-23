import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/plotly-dashboard/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  publicDir: 'public',
  build: {
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'plotly-vendor': ['plotly.js', 'react-plotly.js'],
          'router-vendor': ['react-router-dom'],
        },
      },
    },
    // Increase chunk size warning limit for large libraries like Plotly
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'plotly.js', 'react-plotly.js'],
  },
})
