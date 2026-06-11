import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Clean setup for running locally on your PC
export default defineConfig({
  plugins: [react()]
})