import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
	host: '127.0.0.1',
	headers: {
		'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
		'Cross-Origin-Embedder-Policy': 'require-corp',
	  },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});