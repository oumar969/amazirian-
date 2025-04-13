import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/amazirian-/',  // Sørg for, at dette er korrekt
  plugins: [react()],
});
