import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // This is the dynamic configuration block
    base: command === 'build' ? './' : '/',
    server: {
      host: true, // Allows access from your local network
    }
  }
})