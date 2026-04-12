import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // هذا هو الحل - يخبر السيرفر أن يرجع لـ index.html دائماً
    historyApiFallback: true 
  }
})