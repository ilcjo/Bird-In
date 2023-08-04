import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
//Click outside, press Esc key, or fix the code to dismiss.
//You can also disable this overlay by setting server.hmr.overlay to false in vite.config.js.