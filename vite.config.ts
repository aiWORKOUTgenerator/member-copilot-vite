import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // Use port 3000 instead of default 5173/5174
    strictPort: true, // Fail if port is already in use
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
});
