import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import checker from 'vite-plugin-checker'

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/myclub/' : '/';

// https://vitejs.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
})
