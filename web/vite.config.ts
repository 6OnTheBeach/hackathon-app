import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Où relayer /api : l'API du dev container par défaut ; dans docker compose,
// API_URL=http://api:3000 (le nom du service sur le réseau interne)
const apiUrl = process.env.API_URL ?? 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    proxy: { '/api': apiUrl },
  },
  // vite preview (service web de docker compose) : même relais vers l'API
  preview: {
    port: 4173,
    strictPort: true,
    proxy: { '/api': apiUrl },
  },
});
