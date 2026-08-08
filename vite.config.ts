import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // L'API Mistral n'autorise pas les appels navigateur cross-origin (pas de CORS).
    // On passe donc par le dev-server Vite qui relaie la requête côté Node.
    // La clé API voyage dans l'en-tête Authorization posé par le client (usage local perso).
    proxy: {
      '/api/mistral': {
        target: 'https://api.mistral.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mistral/, ''),
      },
    },
  },
});
