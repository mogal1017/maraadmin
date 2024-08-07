import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preprocessorOptions: {
    css: {
      additionalData: `@import "jsvectormap/dist/css/jsvectormap.css";`,
    },
  },
});
