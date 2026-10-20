import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/agmarknet': {
        target: 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/agmarknet/, ''),
      },
    },
  },
});
