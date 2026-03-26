import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listen on all addresses — try http://127.0.0.1:5173 if localhost fails
    port: 5173,
    strictPort: false,
    // Shareable link needs /api/save. Run `npx vercel dev` (default :3000) in another terminal, then `npm run dev` proxies /api to it.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
})
