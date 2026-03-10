import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    //tells Vitest NOT to touch Playwright files
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/e2e/**'],
  },
})