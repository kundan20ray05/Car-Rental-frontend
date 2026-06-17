import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss() ],
  server: {
    proxy: {
      // Forward API calls made by the React app to the Express backend
      '/api': 'http://localhost:3000',
    },
  },
})

