import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Specific aliases must come before the root @ alias
      '@/components': path.resolve(__dirname, './src/websites/components'),
      '@/pages':      path.resolve(__dirname, './src/websites/pages'),
      '@/layouts':    path.resolve(__dirname, './src/websites/layouts'),
      '@/hooks':      path.resolve(__dirname, './src/websites/hooks'),
      '@/utils':      path.resolve(__dirname, './src/websites/utils'),
      '@/constants':  path.resolve(__dirname, './src/websites/constants'),
      '@/types':      path.resolve(__dirname, './src/websites/types'),
      '@/assets':     path.resolve(__dirname, './src/websites/assets'),
      '@/styles':     path.resolve(__dirname, './src/websites/styles'),
      '@/context':    path.resolve(__dirname, './src/websites/context'),
      '@/portal':     path.resolve(__dirname, './src/websites/portal'),
      '@/admin':      path.resolve(__dirname, './src/admin'),
      '@/vendor':     path.resolve(__dirname, './src/vendor'),
      '@':            path.resolve(__dirname, './src/websites'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
});
