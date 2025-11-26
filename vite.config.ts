import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['motion-dom', 'motion-utils'],
    esbuildOptions: {
      resolveExtensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    },
  },
  resolve: {
    dedupe: ['motion-dom', 'motion-utils'],
    alias: {
      '@assets': path.resolve(__dirname, 'attached_assets'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 5000,
  },
});
