import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const pages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  plugins: [react()],
  base: pages ? '/pebble/' : '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
})
