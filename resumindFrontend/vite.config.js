import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          pdf: ['@react-pdf/renderer', 'pdfjs-dist'],
          three: ['three', 'gsap']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['pdfjs-dist', 'mammoth']
  }
});
