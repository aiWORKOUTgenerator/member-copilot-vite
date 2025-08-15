import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // Use port 5173 (default Vite port)
    strictPort: true, // Fail if port is already in use
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
});
