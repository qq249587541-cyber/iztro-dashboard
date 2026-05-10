import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['iztro'],
  },
  build: {
    commonjsOptions: {
      include: [/iztro-enhanced/, /node_modules/],
    },
    rollupOptions: {
      output: {
        format: 'iife',
        name: 'IztroApp',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
})
