import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // needed for resolving @

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // maps @ to src/
    },
  },
  server: {
    port: 5173, // frontend dev port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
