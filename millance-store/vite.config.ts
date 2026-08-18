import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/pages': path.resolve(__dirname, './pages'),
      '@/layouts': path.resolve(__dirname, './layouts'),
      '@/hooks': path.resolve(__dirname, './hooks'),
      '@/utils': path.resolve(__dirname, './utils'),
      '@/constants': path.resolve(__dirname, './constants'),
      '@/types': path.resolve(__dirname, './types'),
      '@/assets': path.resolve(__dirname, './assets'),
      '@/styles': path.resolve(__dirname, './styles'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
});
