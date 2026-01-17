import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [ react()],
  build: {
    sourcemap: true, // Enables source maps for detailed error logs in the browser console
  },
  base: '/',
});
