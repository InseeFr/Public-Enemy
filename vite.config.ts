/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      projects: [
        './tsconfig.json', // To avoid tsconfigPaths read website tsconfig path
      ],
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
  },

  build: {
    target: 'esnext',
  },
  define: {
    global: 'window',
  },
})