import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':            path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/pages':      path.resolve(__dirname, './pages'),
      '@/layouts':    path.resolve(__dirname, './layouts'),
      '@/hooks':      path.resolve(__dirname, './hooks'),
      '@/utils':      path.resolve(__dirname, './utils'),
      '@/constants':  path.resolve(__dirname, './constants'),
      '@/types':      path.resolve(__dirname, './types'),
      '@/assets':     path.resolve(__dirname, './assets'),
      '@/styles':     path.resolve(__dirname, './styles'),
      '@/context':    path.resolve(__dirname, './context'),
      '@/admin':      path.resolve(__dirname, './admin'),
      '@/vendor':     path.resolve(__dirname, './vendor'),
      '@/portal':     path.resolve(__dirname, './portal'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
});
