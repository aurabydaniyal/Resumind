import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const resolvedApiUrl =
    env.VITE_API_BASE_URL ||
    env.API_BASE_URL ||
    env.VITE_BACKEND_URL ||
    env.BACKEND_URL ||
    process.env.VITE_API_BASE_URL ||
    process.env.API_BASE_URL ||
    process.env.VITE_BACKEND_URL ||
    process.env.BACKEND_URL ||
    '';

  return {
    plugins: [react()],
    define: {
      '__APP_API_URL__': JSON.stringify(resolvedApiUrl)
    },
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
  };
});

